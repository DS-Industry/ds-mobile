export class ExternalBadRequestException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, ExternalBadRequestException);
  }
}
