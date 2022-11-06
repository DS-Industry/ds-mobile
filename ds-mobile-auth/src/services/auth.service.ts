import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AuthRequestDto } from '../dto/req/authentification-request.dto';
import * as otpGenerator from 'otp-generator';
import * as oracledb from 'oracledb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OtpVerificationRequestDto } from '../dto/req/otp-verification-request.dto';
import * as crypto from 'crypto';
import { VerifyClientRepsonseDto } from '../dto/res/verify-client-repsonse.dto';
import { AuthorizedClientResponseDto } from '../dto/res/authorized-client-response.dto';
import { ApiKeyResponseDto } from '../dto/res/api-key-response.dto';
import { SuccessClietAuthDto } from '../dto/res/success-cliet-auth.dto';
import { AuthHttpException } from '../common/exceptions/auth-http.exception';
import { AuthentificationException } from '../common/exceptions/authentification.exception';
import { AddOtpResponseDto } from '../dto/res/add-otp-response.dto';
import { BeelineService } from '../beeline/beeline.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly beelineService: BeelineService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Send OTP code to the phone number provided in parameters
   * @param otpRequestDto
   */
  public async sendOtp(authRequestDto: AuthRequestDto) {
    const { phone } = authRequestDto;
    // 1 - generate otp code
    const otp = this.generateOtp();
    const message = `Ваш код ${otp}`;
    // 2 - add code to database
    /*
    const addOtp: AddOtpResponseDto = await this.addOtpForVerification(
      otp,
      phone,
    );
    */

    const [addOtp, res] = await Promise.all([
      this.addOtpForVerification(otp, phone),
      this.beelineService.send(message, phone),
    ]);

    //const res = await this.beelineService.send(message, phone);

    // 4 - if phone was send successfully return
    // 5 - if not then return error
    return res;
  }

  /**
   * Add generated otp to the database
   * @param otp
   * @param phone
   */
  public async addOtpForVerification(
    otp: string,
    phone: string,
  ): Promise<AddOtpResponseDto> {
    const addOtpDto: AddOtpResponseDto = new AddOtpResponseDto();
    const addOptCodeQuery = `begin :p0 := ds_mobile_pkg.add_phone_code(:p1, :p2); end;`;
    const runAddOtp = await this.dataSource.query(addOptCodeQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      phone,
      otp,
    ]);
    return Object.assign(addOtpDto, runAddOtp[0]);
  }

  /**
   * Validates OTP
   * compares resived otp to the one stored in database for
   * given phone number
   * @param otp
   * @private
   */
  public async validateOtp(otpVerificationRequest: OtpVerificationRequestDto) {
    const { phone, otp } = otpVerificationRequest;
    const clientResponse: SuccessClietAuthDto = new SuccessClietAuthDto();
    let debugMessage: string;
    let authorizedClient: AuthorizedClientResponseDto;

    // 1) Verify otp through PL/SQL
    /*
    const [isValidOtp, client] = await Promise.all([
      this.verifyOtp(phone, otp),
      this.checkExistingClient(phone),
    ]);
    */

    const isValidOtp: boolean = await this.verifyOtp(phone, otp);

    // 2) If otp incorrect throw error
    if (!isValidOtp) throw new AuthHttpException([`Invalid otp request`]);

    // 3) Check if existing user

    const client: VerifyClientRepsonseDto = await this.checkExistingClient(
      phone,
    );

    const { clientId, cardId } = client;

    // 4) If user existing login
    if (clientId && cardId) {
      authorizedClient = await this.signInClient(clientId, cardId);
      debugMessage = `Login - ${phone}`;
    } else {
      // 5) If new user create user
      authorizedClient = await this.registerClient(phone);
      debugMessage = `New user registration - ${phone}; Issued id: ${authorizedClient.clientId}`;
    }

    // 6) Generate API Key and assign to client
    const apiKey: ApiKeyResponseDto = await this.assignClientApiKey(
      authorizedClient.clientId,
    );

    if (!apiKey.keyId)
      throw new AuthentificationException([`Internal authentication error`]);

    this.logger.log(debugMessage);
    return Object.assign(clientResponse, authorizedClient, apiKey);
  }

  /**
   * Register new client through database
   * @param phone
   * @private
   */
  private async registerClient(
    phone: string,
  ): Promise<AuthorizedClientResponseDto> {
    const clientDto: AuthorizedClientResponseDto =
      new AuthorizedClientResponseDto();
    const registerClientQuery = `begin :p0 := ds_mobile_pkg.registrate_card(:p1); end;`;
    const runRegisterClient = await this.dataSource.query(registerClientQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
      phone,
    ]);
    return Object.assign(clientDto, JSON.parse(runRegisterClient[0]));
  }

  /**
   * Authorize existing user through database
   * @param clientId
   * @param cardId
   * @private
   */
  private async signInClient(
    clientId: number,
    cardId: number,
  ): Promise<AuthorizedClientResponseDto> {
    const clientDto: AuthorizedClientResponseDto =
      new AuthorizedClientResponseDto();
    const authorizedClientQuery = `begin :p0 := ds_mobile_pkg.sign_up_client(:p1, :p2); end;`;
    const runSignUp = await this.dataSource.query(authorizedClientQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
      clientId,
      cardId,
    ]);
    return Object.assign(clientDto, JSON.parse(runSignUp[0]));
  }

  /**
   * Check if user already exists in the database
   * @param phone
   * @private
   */
  private async checkExistingClient(
    phone: string,
  ): Promise<VerifyClientRepsonseDto> {
    const verifyClientDto: VerifyClientRepsonseDto =
      new VerifyClientRepsonseDto();
    const clientVerificationQuery = `begin :p0 := ds_mobile_pkg.check_existing_user(:p1); end;`;
    const runClientVerification = await this.dataSource.query(
      clientVerificationQuery,
      [{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 }, phone],
    );

    return Object.assign(verifyClientDto, JSON.parse(runClientVerification[0]));
  }
  /**
   * Verify existing otp in the database
   * @param phone
   * @param otp
   * @private
   */
  private async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const otpVerificationQuery = `select confirm_code from phone_code where phone_number = ${phone} and confirm_code = trim(${otp}) and expire_date >= sysdate`;
    const runVerification = await this.dataSource.query(otpVerificationQuery);
    if (runVerification.length == 0) return false;

    return true;
  }

  /**
   * Assign api key to main api through database
   * @param clientId
   * @private
   */
  private async assignClientApiKey(
    clientId: number,
  ): Promise<ApiKeyResponseDto> {
    const apiKeyDto: ApiKeyResponseDto = new ApiKeyResponseDto();
    const apiKey = this.generateApiKey();
    // 7) Add API Key to db
    const AddApiKeyQuery =
      'begin :p0 := ds_mobile_pkg.add_mobile_api_key(:p1, :p2); end;';
    const runAddApiKey = await this.dataSource.query(AddApiKeyQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
      clientId,
      apiKey,
    ]);
    return Object.assign(apiKeyDto, JSON.parse(runAddApiKey[0]));
  }

  /**
   * Generates 6 digit code for user
   * @private
   */
  private generateOtp() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  }

  /**
   * Generates api key for user
   * @private
   */
  private generateApiKey() {
    const key = crypto.randomBytes(20);
    return key;
  }

  /**
   * Generate random id for sms
   * @private
   */
  private generateUniqueMessageId() {
    return Math.floor(Math.random() * Date.now());
  }
}
