import { Exclude } from 'class-transformer';

export class SuccessClietAuthDto {
  card: string;
  @Exclude()
  keyId: number;
  apiKey: string;
  tokenId: string;
  refreshToken: string;
  clientCard: string;
  @Exclude()
  clientId: number;
}
