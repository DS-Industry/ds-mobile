import {
  IsDefined,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CardOperationsRequest {
  @IsNumberString()
  @IsDefined()
  card: string;

  @Transform(({ value }) => parseInt(value))
  @IsDefined()
  @IsNumber()
  page: number = 0;

  @Transform(({ value }) => parseInt(value))
  @IsDefined()
  @IsNumber()
  size: number = 1;
}
