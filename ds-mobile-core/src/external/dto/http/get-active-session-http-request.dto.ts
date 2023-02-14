import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class GetActiveSessionHttpRequestDto {
  @IsNumber()
  @IsDefined()
  clientId: number;
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?7(9\d{9})$/, {
    message: 'Phone number must be valid',
  })
  phone: string;
  @IsNotEmpty()
  @IsNumberString()
  card: string;
}
