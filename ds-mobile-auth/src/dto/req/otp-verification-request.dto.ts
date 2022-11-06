import {
  IsNotEmpty,
  IsNumberString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OtpVerificationRequestDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?7(9\d{9})$/, {
    message: 'Phone number must be valid',
  })
  phone: string;

  @IsNumberString()
  @MinLength(6, { message: 'Otp must be valid' })
  @MaxLength(6, { message: 'Otp must be valid' })
  otp: string;
}
