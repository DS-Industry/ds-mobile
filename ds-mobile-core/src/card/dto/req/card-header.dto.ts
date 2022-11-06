import { IsDefined, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CardHeader {
  @IsString()
  @IsDefined()
  @Expose({ name: 'access-token' })
  accessToken: string;
}
