import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CustomHttpExceptionResponse } from '../models/http-exception-response.interface';
import { QueryFailedError } from 'typeorm';
import { ThrottlerException } from '@nestjs/throttler';

export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let message;
    let status;

    if (exception instanceof ThrottlerException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = exception.getResponse().message || exception.message;
      this.logger.warn(
        `${request.method} [${request.url}] || ${message}`,
        `${message}`,
      );
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = exception.getResponse().message || exception.message;
      message = exception.message;
      this.logger.error(
        `${request.method} [${request.url}] || ${message}`,
        exception.stack,
        `${message}`,
      );
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Unable to process request';
      this.logger.error(
        `${request.method} [${request.url}] || [TypeOrm]: ${exception.name}`,
        exception.stack,
        request.headers,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      this.logger.error(
        `${request.method} [${request.url}] || ${message}`,
        exception.stack,
        `${message}`,
        exception.stack,
        `${message}`,
      );
    }

    const res: CustomHttpExceptionResponse = this.getErrorResponse(
      status,
      request,
      message,
    );

    response.status(status).json(res);
  }
  private getErrorResponse = (
    status: HttpStatus,
    request: Request,
    error: any,
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
