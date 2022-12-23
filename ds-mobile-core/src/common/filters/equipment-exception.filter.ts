import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { AxiosError } from 'axios';

@Catch(AxiosError)
export class EquipmentExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 503;
    const res = exception.response.data;

    response.status(status).json(res);
  }
}
