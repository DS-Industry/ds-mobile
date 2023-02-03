import { Injectable } from '@nestjs/common';
import { GazpormService } from './gazporm/gazporm.service';
import { GazpromClientDto } from './dto/req/gazprom-client.dto';
import { ExistingSessionDto } from './dto/res/existing-session.dto';
import { SubscribtionStatusDto } from './dto/res/subscribtion-status.dto';
import { GazpormErrorDto } from './dto/res/gazporm-error.dto';

@Injectable()
export class ExternalService {
  constructor(private readonly gazpromService: GazpormService) {}

  public async activatePromotion(client: GazpromClientDto) {
    const { phone } = client;
    const clientToken: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromService.getExistingSession(client.clientId);

    return clientToken;
  }

  public async createRegistrationSession(client: GazpromClientDto) {
    const session: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromService.createRegistrationSession(client);

    return session;
  }

  public async getSubscribtionSatus(client: GazpromClientDto) {
    const status: SubscribtionStatusDto | GazpormErrorDto =
      await this.gazpromService.getSubscriptionStatus(client.clientId);

    return status;
  }
}
