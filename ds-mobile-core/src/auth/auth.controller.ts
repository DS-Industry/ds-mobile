import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAccessTokenRequest } from './dto/req/get-access-token-request.dto';
import { ClientService } from '../client/client.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
  ) {}

  @Post('/access-token')
  public async getAccessToken(
    @Body() getAccessTokenRequest: GetAccessTokenRequest,
    @Req() req,
  ) {
    const apiKey = req.headers['x-api-key'];
    await this.authService.verifyApiKey(apiKey, getAccessTokenRequest.card);
    return this.authService.getAccessToken(getAccessTokenRequest);
  }

  @Get('/client')
  public async getClient(@Req() req) {
    const tokenId = req.headers['token-id'];
    const refreshToken = req.headers['refresh-token'];
    return await this.clientService.getClientByTokenId(tokenId);
  }
}
