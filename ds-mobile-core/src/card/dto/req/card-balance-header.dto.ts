import { IsDefined, IsNumberString, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CardBalanceHeader {
  @IsString()
  @IsDefined()
  @Expose({ name: 'access-token' })
  accessToken: string;

  @IsNumberString()
  @IsDefined()
  @Expose({ name: 'card' })
  card: string;
}
