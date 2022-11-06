import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRequestDto } from '../dto/req/authentification-request.dto';
import { OtpRequestDto } from '../dto/req/otp-request.dto';
import { OtpVerificationRequestDto } from '../dto/req/otp-verification-request.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(5, 60)
  @Post('/verify')
  public verifyOtp(@Body() otpVerificationRequest: OtpVerificationRequestDto) {
    return this.authService.validateOtp(otpVerificationRequest);
  }

  @Post('/send/otp')
  public sendOTP(@Body() authRequestDto: AuthRequestDto) {
    return this.authService.sendOtp(authRequestDto);
  }
}
