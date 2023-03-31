import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PayService } from './pay.service';
import { AddPaymentRequestDto } from './dto/req/add-payment-request.dto';
import { AuthService } from '../auth/auth.service';
import { RequestHeader } from '../common/decorators/request-header.decorator';
import { CardPayHeaderDto } from './dto/req/card-pay-header.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('pay')
export class PayController {
  constructor(
    private readonly payService: PayService,
    private readonly authService: AuthService,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  public async addPayment(
    @Body() addPaymentRequest: AddPaymentRequestDto,
    @Req() req,
  ) {
    const { user } = req;
    return this.payService.addPayment(addPaymentRequest, user);
  }
}
