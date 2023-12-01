import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
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

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(1, 65)
  @Post('/send/otp')
  public async sendOTP(
    @Body() authRequestDto: AuthRequestDto,
    @Req() req: any,
  ) {
    const showModal = req.headers['show_modal'];
    const timeToResult = req.headers['time_to_result'];
    if (!showModal && timeToResult) {
      throw new ForbiddenException('Forbidden');
    }
    return await this.authService.sendOtp(
      authRequestDto,
      showModal,
      timeToResult,
    );
  }

  @Throttle(5, 60)
  @Post('/signup')
  public async signUp(@Body() optVerification: OtpVerificationRequestDto) {
    return await this.authService.signUp(optVerification);
  }

  @Throttle(5, 60)
  @Post('/signin')
  public async signIn(@Body() optVerification: SignInRequestDto) {
    return await this.authService.signIn(optVerification);
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
