import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CarwashService } from '@/carwash/service/carwash.service';
import { DsCloudService } from '@/ds-cloud/ds-cloud.service';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { YaOrder } from '@/carwash/entity/ya-order.entity';
import { OrderExcecutionStatus, OrderStatus, SendStatus } from '@/common/enums';


@Injectable()
export class OrderService {
  constructor(
    @InjectQueue('order-process-queue') private orderQueue: Queue,
    private carwashService: CarwashService,
    private dscloudService: DsCloudService,
  ) {}

  async processOrder(orderRequest: CreateOrderRequest) {
    let newOrder: YaOrder;
    let chargeTime: Date;

    // Accept Yandex order
    try {
      newOrder = await this.carwashService.createOrder(orderRequest);

      await this.carwashService.updateOrderStatus(
        newOrder.id,
        OrderStatus.ORDERCREATED,
      );
      //TODO
      //1. Send order status to Yandex
      //2. Send order update to db after Yandex request
      //3. If error update stats to error
      //4. If error occurs end job
    } catch (e) {
      // Add Logger message
      console.log(e);
      await this.carwashService.setExecutionalError(newOrder.id, e.messsage);
      return;
    }

    //Send request to Ds-Cloud
    try {
      chargeTime = new Date(Date.now());
      const code = await this.dscloudService.startEquipment(
        newOrder.cmnDeviceId,
        newOrder.orderSum,
      );

      //TODO
      //1. Send order status to Yandex
      //2. Send order update to db after Yandex request
      //3. If error update stats to error
      //4. If error occurs update Yandex on error
      //5. If error occurs end job
    } catch (e) {
      console.log(e);
      try {
        await this.carwashService.updateOrderStatus(
          newOrder.id,
          OrderStatus.CARWASHCANCELED,
          null,
          SendStatus.NO,
          null,
          e.message,
          OrderExcecutionStatus.ERROR,
        );

        //Send Yandex status
        //Update Order after Yandex status update
        return;
      } catch (e) {
        console.log(e);
        await this.carwashService.setExecutionalError(newOrder.id, e.message);
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

      //TODO
      //1. Send order status to Yandex
      //2. Send order update to db after Yandex request
      //3. If error update stats to error
      //4. If error occurs end job
    } catch (e) {
      console.log(e);
      await this.carwashService.setExecutionalError(newOrder.id, e.message);
    }
  }

  async testFunction() {
    return await this.carwashService.findAll();
  }
}
