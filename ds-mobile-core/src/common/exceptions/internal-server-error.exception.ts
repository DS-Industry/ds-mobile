export class InternalServerErrorException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, InternalServerErrorException);
  }
}
