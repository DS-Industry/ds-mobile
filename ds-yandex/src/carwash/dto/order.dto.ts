import { OrderStatus } from '@/common/enums';

export class OrderDto {
  id: number;
  externalId: string;
  sum: number;
  cwId: number;
  boxNumber: number;
  createTime: Date;
  status: OrderStatus;
}
