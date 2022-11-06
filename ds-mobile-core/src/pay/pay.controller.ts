import { Body, Controller, Post, Headers } from '@nestjs/common';
import { PayService } from './pay.service';
import { AddPaymentRequestDto } from './dto/req/add-payment-request.dto';
import { AuthService } from '../auth/auth.service';

@Controller('pay')
export class PayController {
  constructor(
    private readonly payService: PayService,
    private readonly authService: AuthService,
  ) {}

  @Post('add')
  public async addPayment(
    @Body() addPaymentRequest: AddPaymentRequestDto,
    @Headers('access-token') accessToken: string,
  ) {
    await this.authService.verifyAccessToken(
      addPaymentRequest.nomer,
      accessToken,
    );
    return this.payService.addPayment(addPaymentRequest);
  }
}
