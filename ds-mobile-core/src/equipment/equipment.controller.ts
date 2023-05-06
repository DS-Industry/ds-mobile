import {
  Controller,
  Body,
  Post,
  Param,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { StartEquipmentRequest } from './dto/req/start-equipment-request.dto';
import { EquipmentExceptionFilter } from '../common/filters/equipment-exception.filter';
import { SkipThrottle } from '@nestjs/throttler';
import { RequestHeader } from '../common/decorators/request-header.decorator';
import { CardHeader } from '../card/dto/req/card-header.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('external')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly authService: AuthService,
  ) {}

  @Post('/start/:id')
  @SkipThrottle(true)
  @UseFilters(EquipmentExceptionFilter)
  @UseGuards(JwtAuthGuard)
  public async startEquipment(
    @RequestHeader(CardHeader) headers: any,
    @Body() startEquipmentRequest: StartEquipmentRequest,
    @Param('id') id: string,
    @Req() req,
  ) {
    const { devNomer } = req.user;
    return this.equipmentService.start(startEquipmentRequest, id, devNomer);
  }
}
