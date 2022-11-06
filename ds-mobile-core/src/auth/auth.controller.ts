import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAccessTokenRequest } from './dto/req/get-access-token-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/access-token')
  public async getAccessToken(
    @Body() getAccessTokenRequest: GetAccessTokenRequest,
    @Req() req,
  ) {
    const apiKey = req.headers['x-api-key'];
    await this.authService.verifyApiKey(apiKey, getAccessTokenRequest.card);
    return this.authService.getAccessToken(getAccessTokenRequest);
  }
}
