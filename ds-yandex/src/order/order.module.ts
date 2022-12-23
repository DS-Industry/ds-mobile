import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderProcessor } from '@/order/order.processor';
import { BullModule } from '@nestjs/bull';
import { CarwashModule } from '@/carwash/carwash.module';
import { DsCloudModule } from '@/ds-cloud/ds-cloud.module';
import { YandexModule } from "@/yandex/yandex.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-process-queue',
    }),
    CarwashModule,
    DsCloudModule,
    YandexModule
  ],
  providers: [OrderService, OrderProcessor],
  exports: [OrderService, BullModule],
})
export class OrderModule {}
