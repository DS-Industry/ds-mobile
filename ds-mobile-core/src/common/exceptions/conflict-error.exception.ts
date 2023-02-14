export class ConflictErrorException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, ConflictErrorException);
  }
}
