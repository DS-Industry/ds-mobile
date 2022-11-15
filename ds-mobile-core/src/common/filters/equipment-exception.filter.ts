import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';

import { AxiosError } from 'axios';

@Catch(AxiosError)
export class EquipmentExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: AxiosError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 503;
    const res = exception.response.data;
    response.status(status).json(res);
  }
}
