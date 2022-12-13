import { Controller, Get, Post } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('carwash')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('order')
  public orderStatus() {
    return null;
  }

  @Post('ping')
  public carWashStatus() {
    return null;
  }

  @Get('list')
  public async getCarWashList() {
    return this.coreService.getCarWashList();
  }
}
