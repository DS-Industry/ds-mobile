import { HttpException } from '@nestjs/common';

export class PingException extends HttpException {
  constructor(code: number) {
    super(null, code);
  }
}
