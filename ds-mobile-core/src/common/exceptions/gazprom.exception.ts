import { HttpException } from '@nestjs/common';

export class GazpromException extends HttpException {
  constructor(code: number, message: string) {
    super(message, code);
  }
}
