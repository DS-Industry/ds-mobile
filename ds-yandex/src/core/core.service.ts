import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DsCloudService } from '../ds-cloud/ds-cloud.service';
import { PingCwStatus } from './dto/req/ping-cw-status.dto';
import { Box } from '../carwash/dto';
import { BoxStatus, OrderStatus } from '../common/enums';
import { PingException } from '@/common/exceptions';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { OrderService } from '@/order/order.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly dsCloudService: DsCloudService,
    @InjectQueue('order-process-queue') private orderQueue: Queue,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Create new order
   * @param createOrderReq
   */
  public async createOrder(createOrderReq: CreateOrderRequest) {
    //TODO
    //1. Check if car wash exists
    const bay: any = await this.dsCloudService.getBay(
      createOrderReq.carWashId,
      +createOrderReq.boxNumber,
    );

    if (!bay) throw new PingException(HttpStatus.BAD_REQUEST);
    //2. Check if bay is free
    if (bay.status === BoxStatus.UNAVAILABLE || bay.status === BoxStatus.BUSY)
      throw new PingException(HttpStatus.UNAUTHORIZED);

    if (createOrderReq.orderStatus != OrderStatus.ORDERCREATED)
      throw new HttpException('Unable to create order', HttpStatus.BAD_REQUEST);

    createOrderReq.boxId = bay.identifier;

    //3. Submit order for process
    await this.orderQueue.add('orderjob', createOrderReq);

    return bay;
  }

  /**
   * Get list of all car washes
   */
  public async getCarWashList() {
    return await this.dsCloudService.getCarWashList();
  }

  public async test() {
    return this.orderService.testFunction();
  }

  /**
   * Ping car wash bay
   * @param pingCwStatusReq
   */
  public async ping(pingCwStatusReq: PingCwStatus) {
    const { carwashId, boxNumber } = pingCwStatusReq;
    const bay: Box = await this.dsCloudService.getBay(carwashId, +boxNumber);

    if (!bay) {
      throw new PingException(HttpStatus.BAD_REQUEST);
    }

    switch (bay.status) {
      case BoxStatus.FREE: {
        return;
        break;
      }
      case BoxStatus.BUSY: {
        throw new PingException(HttpStatus.NOT_FOUND);
        break;
      }
      case BoxStatus.UNAVAILABLE: {
        throw new PingException(HttpStatus.NOT_FOUND);
        break;
      }
      default: {
        break;
      }
    }
  }
}
