import { Injectable } from '@nestjs/common';
import { GazpormService } from './gazporm/gazporm.service';
import { GazpromClientDto } from './dto/req/gazprom-client.dto';
import { ExistingSessionDto } from './dto/res/existing-session.dto';

@Injectable()
export class ExternalService {
  constructor(private readonly gazpromService: GazpormService) {}

  public async activatePromotion(client: GazpromClientDto) {
    const { phone } = client;
    const clientToken: ExistingSessionDto =
      await this.gazpromService.getExistingSession(phone);

    console.log(clientToken);
  }
}
