import { IsDate, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateCardRequestDto {
  @Optional()
  isLocked?: number;
  @Optional()
  dateEnd?: Date;
  @Optional()
  cardTypeId?: number;
  @Optional()
  isDel?: number;
  @Optional()
  gosNomer?: string;
  @Optional()
  note?: string;
  @Optional()
  tag?: string;
}
