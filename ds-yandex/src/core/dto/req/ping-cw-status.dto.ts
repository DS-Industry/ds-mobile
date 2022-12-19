import { IsDefined } from 'class-validator';

export class PingCwStatus {
  @IsDefined()
  carwashId: string;
  @IsDefined()
  boxNumber: string;
}
