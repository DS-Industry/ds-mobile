import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRequestDto } from '../dto/req/authentification-request.dto';
import { OtpVerificationRequestDto } from '../dto/req/otp-verification-request.dto';
import { Throttle } from '@nestjs/throttler';
import { WebActivateRequest } from '../dto/req/web-activate-request.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send/otp')
  public sendOTP(@Body() authRequestDto: AuthRequestDto) {
    return this.authService.sendOtp(authRequestDto);
  }

  @Throttle(5, 60)
  @Post('/signup')
  public signUp(@Body() optVerification: OtpVerificationRequestDto) {
    return this.authService.signUp(optVerification);
  }

  @Throttle(5, 60)
  @Post('/signin')
  public signIn(@Body() optVerification: OtpVerificationRequestDto) {
    return this.authService.signIn(optVerification);
  }

  @Post('web/login')
  public webLogin(@Body() otpVerificationRequest: OtpVerificationRequestDto) {
    return this.authService.webLogin(otpVerificationRequest);
  }

  @Throttle(5, 60)
  @Post('web/activate')
  public webActivate(@Body() webActivateRequest: WebActivateRequest) {
    return this.authService.webActivate(webActivateRequest);
  }
}
