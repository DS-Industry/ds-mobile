import { HttpException } from '@nestjs/common';
import { StartEquipmentErrorRes } from '@/ds-cloud/dto/res/start-equipment-error-res.dto';

export class BayUnavailableException extends HttpException {
  constructor(
    response: StartEquipmentErrorRes,
    code: number,
    option: any = null,
  ) {
    super(response, code, option);
  }
}
