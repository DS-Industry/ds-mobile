import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-custom';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  async validate(req: Request): Promise<any> {
    const accessToken = req.headers['access_token'];
    const card = req.headers['card'];

    if (!accessToken)
      throw new UnauthorizedException('Access token is missing');

    if (!card) throw new UnauthorizedException('Card number is missing');

    try {
    } catch (e) {}
  }
}
