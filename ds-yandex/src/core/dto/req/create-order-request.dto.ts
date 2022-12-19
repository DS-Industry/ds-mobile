import { OrderStatus } from '@/common/enums';
import { IsEnum, IsOptional } from 'class-validator';
import { Price } from '@/carwash/dto';

export class CreateOrderRequest {
  id: string;
  dateCreate: Date;
  carWashId: string;
  boxNumber: string;
  @IsOptional()
  boxId?: string;
  @IsEnum(OrderStatus)
  @IsOptional()
  orderStatus?: OrderStatus;
  sum: number;
  sumCompleted: number;
  @IsOptional()
  services?: Price[];
  @IsOptional()
  description?: string;
  contractId: string;
}
