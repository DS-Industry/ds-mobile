import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CarwashService } from '@/carwash/service/carwash.service';
import { DsCloudService } from '@/ds-cloud/ds-cloud.service';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { YaOrder } from '@/carwash/entity/ya-order.entity';
import { OrderExcecutionStatus, OrderStatus, SendStatus } from '@/common/enums';
import { YandexService } from '@/yandex/yandex.service';
import { queuePool } from "@/bull-admin/bull-board-queue";

@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('order-process-queue') private orderQueue: Queue,
    private carwashService: CarwashService,
    private dscloudService: DsCloudService,
    private yandexService: YandexService,
  ) {
    queuePool.add(this.orderQueue);
  }

  async processOrder(orderRequest: CreateOrderRequest) {
    let newOrder: YaOrder;
    let chargeTime: Date;

    // Accept Yandex order
    try {
      newOrder = await this.carwashService.createOrder(orderRequest);

      await this.carwashService.updateOrderStatus(
        newOrder.id,
        OrderStatus.ORDERCREATED,
        null,
        SendStatus.NO,
      );
      await this.yandexService.accept(newOrder.externalId);
      await this.carwashService.updateOrderStatus(
        newOrder.id,
        OrderStatus.ORDERCREATED,
        null,
        SendStatus.YES,
      );
    } catch (e) {
      // Add Logger message
      await this.carwashService.setExecutionalError(
        newOrder.id,
        e.options.reason,
      );
      return;
    }

    //Send request to Ds-Cloud
    try {
      chargeTime = new Date(Date.now());
      const code = await this.dscloudService.startEquipment(
        newOrder.cmnDeviceId,
        newOrder.orderSum,
      );
    } catch (e) {
      try {
        await this.carwashService.updateOrderStatus(
          newOrder.id,
          OrderStatus.CARWASHCANCELED,
          null,
          SendStatus.NO,
          null,
          e.response.error,
          OrderExcecutionStatus.ERROR,
        );
        //Send Yandex status
        await this.yandexService.canceled(
          newOrder.externalId,
          e.response.error,
        );
        //Update Order after Yandex status update
        await this.carwashService.updateOrderStatus(
          newOrder.id,
          OrderStatus.CARWASHCANCELED,
          null,
          SendStatus.YES,
          new Date(Date.now()),
        );
        return;
      } catch (e) {
        await this.carwashService.setExecutionalError(
          newOrder.id,
          e.options.reason,
        );
        return;
      }
    }

    //Compete order processing
    try {
      await this.carwashService.updateOrderStatus(
        newOrder.id,
        OrderStatus.COMPLETED,
        chargeTime,
        SendStatus.NO,
      );

      await this.yandexService.completed(
        newOrder.externalId,
        newOrder.orderSum,
        newOrder.id,
        chargeTime,
      );
      await this.carwashService.updateOrderStatus(
        newOrder.id,
        OrderStatus.COMPLETED,
        null,
        SendStatus.YES,
        new Date(Date.now()),
        OrderExcecutionStatus.COMPLETED,
      );
    } catch (e) {
      await this.carwashService.setExecutionalError(
        newOrder.id,
        e.options.reason,
      );
    }
  }

  async testFunction() {
    return await this.carwashService.findAll();
  }
}
