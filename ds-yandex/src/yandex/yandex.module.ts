import { Module } from '@nestjs/common';
import { YandexService } from './yandex.service';

@Module({
  controllers: [],
  providers: [YandexService],
})
export class YandexModule {}
