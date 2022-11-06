import { IsNotEmpty, IsString } from 'class-validator';

export class GetAccessTokenRequest {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString()
  refresh_token: string;

  @IsNotEmpty({ message: 'Token id is required' })
  @IsString()
  token_id: string;

  @IsNotEmpty({ message: 'Card is required' })
  @IsString()
  card: string;
}
