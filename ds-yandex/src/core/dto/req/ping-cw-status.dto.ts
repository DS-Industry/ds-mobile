import { IsDefined } from 'class-validator';

export class PingCwStatus {
  @IsDefined()
  apikey: string
  @IsDefined()
  carwashId: string;
  @IsDefined()
  boxNumber: string;
}
