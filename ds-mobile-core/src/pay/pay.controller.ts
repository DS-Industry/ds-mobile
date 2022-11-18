import { Body, Controller, Post, Headers } from '@nestjs/common';
import { PayService } from './pay.service';
import { AddPaymentRequestDto } from './dto/req/add-payment-request.dto';
import { AuthService } from '../auth/auth.service';
import { RequestHeader } from '../common/decorators/request-header.decorator';
import { CardPayHeaderDto } from './dto/req/card-pay-header.dto';

@Controller('pay')
export class PayController {
  constructor(
    private readonly payService: PayService,
    private readonly authService: AuthService,
  ) {}

  @Post('add')
  public async addPayment(
    @Body() addPaymentRequest: AddPaymentRequestDto,
    @RequestHeader(CardPayHeaderDto) headers: any,
  ) {
    await this.authService.verifyAccessToken(headers.card, headers.accessToken);
    return this.payService.addPayment(addPaymentRequest);
  }
}
