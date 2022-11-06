import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { CustomHttpExceptionResponse } from '../models/http-exception-response.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
      const res: CustomHttpExceptionResponse = this.getErrorResponse(
        status,
        request,
        exception.response.message,
      );
      this.logger.error(`[HTTP]: ${res.error}`, exception.stack);
      response.status(status).json(res);
      return;
    }

    const res: CustomHttpExceptionResponse = this.getErrorResponse(
      status,
      request,
      exception.response.message,
    );
    this.logger.error(`[SERVER]: ${res.error}`, exception.stack);
    response.status(status).json(res);
  }
  private getErrorResponse = (
    status: HttpStatus,
    request: Request,
    error: string[],
  ): CustomHttpExceptionResponse => {
    return {
      statusCode: status,
      error: error,
      path: request.url,
      method: request.method,
      timeStamp: new Date().toISOString(),
    };
  };
}
