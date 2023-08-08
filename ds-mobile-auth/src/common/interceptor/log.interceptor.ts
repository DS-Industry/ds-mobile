import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const headers = JSON.stringify(request.headers);

    this.logger.log(
      `Incoming request - Method: ${method}, URL: ${url}, Headers: ${headers}`,
    );

    return next.handle();
  }
}
