import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { GazpromException } from '../exceptions/gazprom.exception';

@Catch(GazpromException)
export class GazpromExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger()
  constructor() {}

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);
    this.logger.error(
      `${GazpromExceptionFilter.name} `,
      exception.stack,
      request.headers,
    );
  }
}
