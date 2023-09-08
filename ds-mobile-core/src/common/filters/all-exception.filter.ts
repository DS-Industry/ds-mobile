import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpExceptionResponse } from '../models/http-exception-response.interface';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message;
    let code;
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
      code = 'UnprocessableEntityException';
      message = 'Unable to process request';
      this.logger.error(
        `${request.method} [${request.url}] || [TypeOrm]: ${exception.name}`,
        exception.stack,
        request.headers,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = exception.name;
      message = 'Internal Server Error';
      this.logger.error(
        `${request.method} [${request.url}] || ${message}`,
        exception.stack,
        `${message}`,
        exception.stack,
        `${message}`,
      );
    }

    const res: HttpExceptionResponse = this.getErrorResponse(
      status,
      request,
      code,
      message,
    );

    response.status(status).json(res);
  }

  /**
   * Get exception reponse body
   * @param status
   * @param request
   * @param error
   * @param message
   */
  private getErrorResponse = (
    status: HttpStatus,
    request: Request,
    error: string,
    message: string,
  ): HttpExceptionResponse => {
    return {
      timestamp: new Date().toISOString(),
      status: status,
      error: error,
      message: message,
      path: request.url,
    };
  };
}
