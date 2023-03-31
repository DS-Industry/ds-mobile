import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'x-api-key',
) {
  constructor(private readonly authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, true, async (apiKey, done) =>
      this.validateKey(apiKey, done),
    );
  }

  public async validateKey(
    incommmingApiKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    const client = await this.authService.verifyApiKey(incommmingApiKey, null);

    if (!client) return done(new UnauthorizedException(), false);

    done(null, client);
  }
}
