import { IsDefined, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CardPayHeaderDto {
  @IsString()
  @IsDefined()
  @Expose({ name: 'access-token' })
  accessToken: string;

  @IsString()
  @IsDefined()
  @Expose({ name: 'card' })
  card: string;
}
