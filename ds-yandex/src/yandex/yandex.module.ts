import { Module } from '@nestjs/common';
import { YandexService } from './yandex.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [YandexService],
  exports: [YandexService],
})
export class YandexModule {}
