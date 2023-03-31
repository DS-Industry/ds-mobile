import { Optional } from '@nestjs/common';

export class StartEquipmentRequest {
  GVLCardNum: string;
  GVLCardSum: string;
  @Optional()
  GVLSource: number;
}
