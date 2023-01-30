import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GetAccessTokenRequest } from './dto/req/get-access-token-request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { AccessTokenResponseDto } from './dto/res/access-token-response.dto';
import { ClientService } from '../client/client.service';
import { JwtService } from '@nestjs/jwt';
import { IPayloadJwt } from './interface/payload.interface';
import { ConfigService } from '@nestjs/config';
import { GetClientByTokensResponseDto } from '../client/dto/res/get-client-by-tokens-response.dto';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get access token fot the api through database
   * @param getAccessTokenRequest
   */
  public async getAccessToken(
    getAccessTokenRequest: GetAccessTokenRequest,
  ): Promise<AccessTokenResponseDto> {
    const { refresh_token, token_id } = getAccessTokenRequest;
    const tokens: AccessTokenResponseDto = await this.generateAccessToken(
      token_id,
      refresh_token,
    );
    if (!tokens) throw new Error('Ошибка получениф текена доступа');

    return tokens;
  }

  /**
   * Verify user api key in database
   * @param apiKey
   * @param card
   */
  public async verifyApiKey(apiKey: string, card: string): Promise<unknown> {
    const client = await this.clientService.getClientByApiKey(apiKey);
    /*
    const verifyApiKeyQuery = `begin :p0 := ds_mobile_pkg.check_api_key(:p1, :p2); end;`;
    const runVerifyApiKey = await this.dataSource.query(verifyApiKeyQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      card,
      apiKey,
    ]);
    if (runVerifyApiKey[0] <= 0)
      throw new UnauthorizedException('Invalid api key');
  */
    return client;
  }

  /**
   * Verify user access token
   * @param card
   * @param accessToken
   */
  public async verifyAccessToken(
    card: string,
    accessToken: string,
  ): Promise<boolean> {
    const verifyAccessToeknQuery = `begin :p0 := ds_mobile_pkg.check_token(:p1, :p2); end;`;
    const runVerifyAccessToken = await this.dataSource.query(
      verifyAccessToeknQuery,
      [{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, card, accessToken],
    );
    if (runVerifyAccessToken[0] <= 0)
      throw new UnauthorizedException('Invalid access token');

    return true;
  }

  public async getClientByTokenId(
    tokenId: string,
  ): Promise<GetClientByTokensResponseDto> {
    return await this.clientService.getClientByTokenId(tokenId);
  }

  public async signToken(payload: IPayloadJwt) {
    const accessTokenResponse: AccessTokenResponseDto =
      new AccessTokenResponseDto();
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });

    accessTokenResponse.access_token = token;
    accessTokenResponse.expire_date = moment(new Date(Date.now()))
      .add(2, 'h')
      .toISOString();

    return accessTokenResponse;
  }

  /**
   * Generate access token from database
   * @param tokenId
   * @param refreshToken
   * @private
   */
  private async generateAccessToken(
    tokenId: string,
    refreshToken: string,
  ): Promise<AccessTokenResponseDto> {
    const accessTokenResponse: AccessTokenResponseDto =
      new AccessTokenResponseDto();
    const generateAccessTokenQuery = `begin :p0 := ds_mobile_pkg.generate_access_token(:p1, :p2); end;`;
    const runGenerateAccessToken = await this.dataSource.query(
      generateAccessTokenQuery,
      [
        { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
        tokenId,
        refreshToken,
      ],
    );
    return Object.assign(
      accessTokenResponse,
      JSON.parse(runGenerateAccessToken[0]),
    );
  }
}
