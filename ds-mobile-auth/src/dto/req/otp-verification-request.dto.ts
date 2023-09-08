import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  isTermsAccepted?: number;


  @IsNumber()
  @Min(0)
  @Max(1)
  isLetterAccepted?: number = 0;

  @IsOptional()
  @IsString()
  promoCode?: string;
}
