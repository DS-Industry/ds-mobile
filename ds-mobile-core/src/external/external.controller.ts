import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExternalService } from './external.service';
import { GazpromClientDto } from './dto/req/gazprom-client.dto';

@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Post('/gazprom/active')
  async avtivateGazpromPromo(@Body() client: GazpromClientDto) {
    return this.externalService.activatePromotion(client);
  }

  @Post('gazprom/registartion')
  async createRegistrationSession(@Body() client: GazpromClientDto) {
    return this.externalService.createRegistrationSession(client);
  }

  @Get('gazprom/status')
  async getSubscribtionStatus(@Body() client: GazpromClientDto) {
    return this.externalService.getSubscribtionSatus(client);
  }
}
