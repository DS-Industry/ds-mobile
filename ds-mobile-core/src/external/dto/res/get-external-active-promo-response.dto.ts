import { SubscribtionStatus } from '../../../common/enums/subscribtion-status.enum';

export class GetExternalActivePromoResponseDto {
  promoStatus: SubscribtionStatus;
  promoTariff: boolean;
}
