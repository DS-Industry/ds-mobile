import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAccessTokenRequest } from './dto/req/get-access-token-request.dto';
import { IPayloadJwt } from './interface/payload.interface';
import { ApiKeyGuard } from './guard/api-key.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(20, 60)
  @Post('/access-token')
  @UseGuards(ApiKeyGuard)
  public async getAccessToken(
    @Body() getAccessTokenRequest: GetAccessTokenRequest,
    @Req() req,
  ) {
    const payload: IPayloadJwt = {
      tokenId: getAccessTokenRequest.token_id,
      card: getAccessTokenRequest.card,
    };
    const { user } = req;
    const token = await this.authService.signToken(payload);
    return { clientId: user.clientId, ...token };
  }
}
