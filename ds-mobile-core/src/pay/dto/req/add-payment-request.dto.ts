import { IsDate, IsDefined, IsNumberString, IsString } from 'class-validator';
export class AddPaymentRequestDto {
  @IsDefined()
  @IsString()
  date: string;

  @IsDefined()
  @IsNumberString()
  nomer: string;

  @IsDefined()
  @IsString()
  email: string;

  @IsString()
  @IsDefined()
  phone: string;
  operSum: number;

  @IsString()
  @IsDefined()
  extId: string;
  token: string;
}
