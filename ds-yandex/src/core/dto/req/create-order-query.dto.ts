import { IsDefined } from 'class-validator';

export class CreateOrderQuery {
  @IsDefined()
  apikey: string;
}
