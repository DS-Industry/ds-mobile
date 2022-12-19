import { HttpException } from '@nestjs/common';

export class BayUnavailableException extends HttpException {
  constructor(message: string, code: number) {
    super(message, code);
  }
}
