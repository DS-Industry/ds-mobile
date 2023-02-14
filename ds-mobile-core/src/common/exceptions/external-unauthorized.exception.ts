export class ExternalUnauthorizedException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, ExternalUnauthorizedException);
  }
}
