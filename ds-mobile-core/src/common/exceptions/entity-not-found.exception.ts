export class EntityNotFoundException extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, EntityNotFoundException);
  }
}
