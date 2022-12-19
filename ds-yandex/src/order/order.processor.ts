import { Process, Processor } from '@nestjs/bull';
import { OrderService } from '@/order/order.service';
import { Job } from 'bull';

@Processor('order-process-queue')
export class OrderProcessor {
  constructor(private readonly orderService: OrderService) {}

  @Process('orderjob')
  async processOrder(job: Job) {
    await this.orderService.processOrder(job.data);
  }
}
