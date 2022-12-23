import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '@/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'apikey',
) {
  constructor(private authService: AuthService) {
    super({ header: 'apikey', prefix: '' }, true, async (apiKey, done) =>
      this.validateKey(apiKey, done),
    );
  }

  private validateKey(
    incomingApiKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    const match = this.authService.validateKey(incomingApiKey);

    if (!match) return done(new UnauthorizedException(), false);

    done(null, true);
  }
}
