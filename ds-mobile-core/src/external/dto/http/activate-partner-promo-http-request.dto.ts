import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class ActivatePartnerPromoHttpRequestDto {
  @IsNumber()
  @IsDefined()
  clientId: number;
  @IsNotEmpty()
  @IsNumberString()
  card: string;
}
