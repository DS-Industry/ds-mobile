import { Injectable } from '@nestjs/common';
import { GazpormService } from './gazporm/gazporm.service';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { GetActiveExternalSessionDto } from './dto/req/get-active-external-session.dto';
import { GetExistingSessionDto } from './gazporm/dto/req/get-existing-session.dto';
import { GetExistingSessionResponseDto } from './gazporm/dto/res/get-existing-session-response.dto';
import { CreateGazpormClientDto } from './gazporm/dto/req/create-gazporm-client.dto';
import { CreateGazpromClientResponseDto } from './gazporm/dto/res/create-gazprom-client-response.dto';
import { GetActiveExternalSessionResponseDto } from './dto/res/get-active-external-session-response.dto';
import { ExternalClientStatus } from '../common/enums/external-client-status.enum';

@Injectable()
export class ExternalService {
  constructor(private readonly gazpromService: GazpormService) {}

  public async getActiveSession(
    data: GetActiveExternalSessionDto,
  ): Promise<GetActiveExternalSessionResponseDto> {
    const { clientId, phone } = data;
    let response: GetActiveExternalSessionResponseDto;
    try {
      const existingSessionData: GetExistingSessionDto = {
        clientId: clientId.toString(),
      };
      const existingSession: GetExistingSessionResponseDto =
        await this.gazpromService.getExistingSession(existingSessionData);

      response = {
        existingClient:
          existingSession.clientStatus == ExternalClientStatus.EXISTING && true,
      };
      return response;
    } catch (e) {
      if (!(e instanceof EntityNotFoundException)) {
        throw e;
      }
    }

    const createNewSessionDto: CreateGazpormClientDto = {
      clientId: clientId.toString(),
      phone: phone,
    };
    const newSession: CreateGazpromClientResponseDto =
      await this.gazpromService.createRegistrationSession(createNewSessionDto);

    response = {
      existingClient:
        newSession.clientStatus == ExternalClientStatus.NEW && false,
    };
    return response;
  }
}
