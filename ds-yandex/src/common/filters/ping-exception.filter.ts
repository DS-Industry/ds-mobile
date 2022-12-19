import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PingException } from '@/common/exceptions';
import { Request, Response } from 'express';

@Catch(PingException)
export class PingExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = exception.getStatus();

    response.status(code).send();
  }
}
