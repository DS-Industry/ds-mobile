import { HttpException } from '@nestjs/common';
import { SendYandexStatusRes } from '@/yandex/dto/res/send-yandex-status-res.dto';

export class YandexClientException extends HttpException {
  constructor(
    code: number,
    response: SendYandexStatusRes,
    options: any = null,
  ) {
    super(response, code, options);
  }
}
