import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { HttpExceptionResponse } from '../models/http-exception-response.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message;
    let code;
    let status;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      code = exception.name;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = exception.getResponse().message || exception.message;
      this.logger.error(`[HTTP]: ${code}`, exception.stack);
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      code = 'UnprocessableEntityException';
      message = 'Unable to process request';
      this.logger.error(`[TypeOrm]: ${exception.name}`, exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = exception.name;
      message = 'Internal Server Error';
      this.logger.error(`[SERVER]: ${exception.name}`, exception.stack);
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
