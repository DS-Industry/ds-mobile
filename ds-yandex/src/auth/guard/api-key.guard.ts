import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard extends AuthGuard('apikey') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request && request.query['apikey'] && !request.header('apikey')) {
      (request.headers['apikey'] as any) = request.query['apikey'];
    }
    return super.canActivate(context);
  }
}
