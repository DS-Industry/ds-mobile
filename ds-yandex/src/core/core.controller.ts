import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { PingCwStatus } from './dto/req/ping-cw-status.dto';
import { PingExceptionFilter } from '@/common/filters';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';

@Controller('carwash')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('/order')
  @UseFilters(PingExceptionFilter)
  public orderStatus(@Body() createOrderReq: CreateOrderRequest) {
    return this.coreService.createOrder(createOrderReq);
  }

  @Get('/ping')
  @UseFilters(PingExceptionFilter)
  @HttpCode(200)
  public carWashStatus(@Query() pingCwStatusReq: PingCwStatus) {
    return this.coreService.ping(pingCwStatusReq);
  }

  @Get('/list')
  @HttpCode(200)
  public async getCarWashList() {
    return this.coreService.getCarWashList();
  }

  @Get('/test')
  public async test(){
    return this.coreService.test();
  }
}
