import { SubscribtionStatus } from '../../../common/enums/subscribtion-status.enum';

export class GetExternalSubscribtionResponseDto {
  promoStatus: SubscribtionStatus;
  promoTariff?: boolean;
}
