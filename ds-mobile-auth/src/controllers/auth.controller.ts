import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  LoggerService,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthRequestDto } from '../dto/req/authentification-request.dto';
import { OtpVerificationRequestDto } from '../dto/req/otp-verification-request.dto';
import { Throttle } from '@nestjs/throttler';
import { WebActivateRequest } from '../dto/req/web-activate-request.dto';
import { SignInRequestDto } from '../dto/req/sign-in-request.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
    if (!req.headers['show_modal']) {
      this.logger.warn(
        `OTP debug missing header [show_modal]: Headers: ${JSON.stringify(
          req.headers,
        )} Phone: ${authRequestDto.phone}`,
      );
      return { message: 'Sucess' };
    }

    if (!req.headers['time_to_result']) {
      this.logger.warn(
        `OTP debug missing header [show_modal]: Headers: ${JSON.stringify(
          req.headers,
        )} Phone: ${authRequestDto.phone}`,
      );
      return { message: 'Sucess' };
    }
    return this.authService.sendOtp(authRequestDto);
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
