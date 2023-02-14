import { SubscribtionStatus } from '../../../../common/enums/subscribtion-status.enum';

export class GetSubscribtionStatusResponseDto {
  status: SubscribtionStatus;
  expirationAt: Date;
}
