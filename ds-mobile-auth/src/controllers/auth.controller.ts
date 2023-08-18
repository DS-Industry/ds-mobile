import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRequestDto } from '../dto/req/authentification-request.dto';
import { OtpVerificationRequestDto } from '../dto/req/otp-verification-request.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { WebActivateRequest } from '../dto/req/web-activate-request.dto';
import { SignInRequestDto } from '../dto/req/sign-in-request.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { join } from 'path';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Throttle(1, 60)
  @Post('/send/otp')
  public sendOTP(@Body() authRequestDto: AuthRequestDto, @Req() req: any) {
    // set headers to a variable
    const showModal = req.headers['show_modal'];
    const timeToResult = req.headers['time_to_result'];
    if (!showModal) {
      this.logger.warn(
        `OTP debug missing header [show_modal]: Headers: ${JSON.stringify(
          req.headers,
        )} Phone: ${authRequestDto.phone}`,
      );
      return { message: 'Sucess' };
    }

    if (!timeToResult) {
      this.logger.warn(
        `OTP debug missing header [show_modal]: Headers: ${JSON.stringify(
          req.headers,
        )} Phone: ${authRequestDto.phone}`,
      );
      return { message: 'Sucess' };
    }
    return this.authService.sendOtp(authRequestDto, timeToResult, showModal);
  }

  @Throttle(5, 60)
  @Post('/signup')
  public signUp(@Body() optVerification: OtpVerificationRequestDto) {
    return this.authService.signUp(optVerification);
  }

  @Throttle(5, 60)
  @Post('/signin')
  public signIn(@Body() optVerification: SignInRequestDto) {
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
