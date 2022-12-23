import { OrderStatus } from '@/common/enums';
import { IsEnum, IsOptional } from 'class-validator';
import { Price } from '@/carwash/dto';
import { Transform } from 'class-transformer';
import { dateInputTransform } from '@/common/utils';

export class CreateOrderRequest {
  id: string;
  @Transform(({ value }) => dateInputTransform(value, 'DD.MM.YYYY, hh:mm:ss'))
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
