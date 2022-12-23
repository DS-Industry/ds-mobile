import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YaOrder } from '@/carwash/entity/ya-order.entity';
import { Repository } from 'typeorm';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { OrderExcecutionStatus, OrderStatus, SendStatus } from "@/common/enums";

@Injectable()
export class CarwashService {
  constructor(
    @InjectRepository(YaOrder) private repository: Repository<YaOrder>,
  ) {}

  async createOrder(orderRequest: CreateOrderRequest): Promise<YaOrder> {
    const order = new YaOrder();

    order.externalId = orderRequest.id;
    order.boxNumber = parseInt(orderRequest.boxNumber);
    order.cmnCarWashId = parseInt(orderRequest.carWashId);
    order.cmnDeviceId = parseInt(orderRequest.boxId);
    order.description = orderRequest.description;
    order.contractId = orderRequest.contractId;
    order.orderSum = orderRequest.sum;
    order.orderTime = new Date(orderRequest.dateCreate);
    order.status = orderRequest.orderStatus;

    const newOrder = await this.repository.create(order);

    await this.repository.save(newOrder);

    return newOrder;
  }

  async setExecutionalError(id: number, error: string) {
    await this.repository.update(id, {
      errorExcecution: error,
      statusExecution: OrderExcecutionStatus.ERROR,
    });
  }

  async findAll() {
    return this.repository.find();
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    chargeTime: Date = null,
    sendStatus: SendStatus = null,
    sendTime: Date = null,
    error: string = null,
    statusExecution: OrderExcecutionStatus = null,
  ) {
    await this.repository.update(id, {
      status: status,
      chargeTime: chargeTime,
      sendStatus: sendStatus,
      sendTime: sendTime,
      errorReason: error,
      statusExecution: statusExecution,
    });
  }
}
