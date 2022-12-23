import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private apiKey: string;
  constructor(private configService: ConfigService) {
    this.apiKey = configService.get<string>('INTERNAL_API_KEY');
  }

  public validateKey(apiKey: string): boolean {
    return apiKey === this.apiKey;
  }
}
