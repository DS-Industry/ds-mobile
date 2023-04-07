import { SubscribtionStatus } from '../../../../common/enums/subscribtion-status.enum';

export class UpdateStatusDto {
  meta: clientInfo;
}

class clientInfo {
  cashback_discount: string;
  cashback_discount_expires_at: string;
  offer_status: SubscribtionStatus;
}
