import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'access-token',
) {
  constructor() {
    super();
  }

  public validateToken() {}
}
