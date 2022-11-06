import { IsDefined, IsNumberString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CardBalanceRequest {
  @IsNumberString()
  @IsDefined()
  @Expose({ name: 'card' })
  card: string;
}
