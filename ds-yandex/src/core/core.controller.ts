import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { PingCwStatus } from './dto/req/ping-cw-status.dto';
import { PingExceptionFilter } from '@/common/filters';
import { CreateOrderRequest } from '@/core/dto/req/create-order-request.dto';
import { ApiKeyGuard } from '@/auth/guard/api-key.guard';
import { CreateOrderQuery } from '@/core/dto/req/create-order-query.dto';

@Controller('carwash')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('/order')
  @UseGuards(ApiKeyGuard)
  @UseFilters(PingExceptionFilter)
  public orderStatus(
    @Query() creteOrderQuery: CreateOrderQuery,
    @Body() createOrderReq: CreateOrderRequest,
  ) {
    return this.coreService.createOrder(createOrderReq);
  }

  @Get('/ping')
  @UseGuards(ApiKeyGuard)
  @UseFilters(PingExceptionFilter)
  @HttpCode(200)
  public carWashStatus(@Query() pingCwStatusReq: PingCwStatus) {
    return this.coreService.ping(pingCwStatusReq);
  }

  @Get('/list')
  @UseGuards(ApiKeyGuard)
  @HttpCode(200)
  public async getCarWashList() {
    return this.coreService.getCarWashList();
  }

  @Get('/test')
  public async test() {
    return this.coreService.test();
  }
}
