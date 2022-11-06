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

@Injectable()
export class AuthService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

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
  public async verifyApiKey(apiKey: string, card: string): Promise<boolean> {
    const verifyApiKeyQuery = `begin :p0 := ds_mobile_pkg.check_api_key(:p1, :p2); end;`;
    const start = new Date().getTime();
    const runVerifyApiKey = await this.dataSource.query(verifyApiKeyQuery, [
      { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      card,
      apiKey,
    ]);
    const end: any = new Date().getTime() - start;
    console.log('Api Key check execution time: %dms', end);
    if (runVerifyApiKey[0] <= 0)
      throw new UnauthorizedException('Invalid api key');

    return true;
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
    const start = new Date().getTime();
    const runGenerateAccessToken = await this.dataSource.query(
      generateAccessTokenQuery,
      [
        { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 2000 },
        tokenId,
        refreshToken,
      ],
    );
    const end: any = new Date().getTime() - start;

    return Object.assign(
      accessTokenResponse,
      JSON.parse(runGenerateAccessToken[0]),
    );
  }
}
