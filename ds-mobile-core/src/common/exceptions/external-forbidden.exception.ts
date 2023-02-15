export class ExternalForbiddenException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
