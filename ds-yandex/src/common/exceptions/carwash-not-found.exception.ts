import { HttpException } from '@nestjs/common';

export class CarwashNotFoundException extends HttpException {
  constructor(code: number) {
    super(null, code);
  }
}
