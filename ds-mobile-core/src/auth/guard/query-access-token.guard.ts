import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class QueryAccessTokenGuard extends AuthGuard('access-token') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request && request.query['card'] && !request.header('card')) {
      (request.headers['card'] as any) = request.query['api-key'];
    }
    return super.canActivate(context);
  }
}
