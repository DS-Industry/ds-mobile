import { Body, Controller, Post } from '@nestjs/common';
import { ExternalService } from './external.service';
import { GazpromClientDto } from './dto/req/gazprom-client.dto';

@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Post('/gazprom/active')
  async avtivateGazpromPromo(@Body() client: GazpromClientDto) {
    return this.externalService.activatePromotion(client);
  }
}
