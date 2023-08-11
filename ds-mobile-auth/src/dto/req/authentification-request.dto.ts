import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class AuthRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?7(9\d{9})$/, {
    message: 'Phone number must be valid',
  })
  phone: string;
  @IsString()
  @IsNotEmpty()
  token: string;
}
