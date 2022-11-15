import { Controller, Body, Post, Param, UseFilters } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { StartEquipmentRequest } from './dto/req/start-equipment-request.dto';
import { EquipmentExceptionFilter } from '../common/filters/equipment-exception.filter';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('external')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post('/start/:id')
  @SkipThrottle(true)
  @UseFilters(new EquipmentExceptionFilter())
  public async startEquipment(
    @Body() startEquipmentRequest: StartEquipmentRequest,
    @Param('id') id: string,
  ) {
    return this.equipmentService.start(startEquipmentRequest, id);
  }
}
