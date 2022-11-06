import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class OtpRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(6, { message: 'OTP code must be valid' })
  otp: string;
}
