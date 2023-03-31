import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class GetSubscribtionStatusHttpRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  @IsDefined()
  clientId: string;
  @IsNotEmpty()
  @IsDefined()
  @IsNumberString()
  card: string;
}
