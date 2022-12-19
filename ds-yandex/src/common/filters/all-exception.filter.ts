import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IHttpException } from '../interfaces';

export class AllExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message;
    let code;
    let status;
    let res;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = exception.getResponse().message || exception.message;
      res = this.getExceptionResponse(status, message, request);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = exception.name;
      message = 'Internal Server Error';
      res = this.getExceptionResponse(status, message, request);
    }

    console.log(exception);
    response.status(status).send(res);
  }

  private getExceptionResponse = (
    status: HttpStatus,
    message: string,
    request: Request,
  ): IHttpException => {
    return {
      timestamp: new Date(),
      status,
      message,
      path: request.url,
    };
  };
}
