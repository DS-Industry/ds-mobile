import { IsDate, IsDefined, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CardOperationsPdfRequestDto {
  @IsNumberString()
  @IsDefined()
  card: string;

  @IsDefined()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  beginDate: Date;

  @IsDefined()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;
}
