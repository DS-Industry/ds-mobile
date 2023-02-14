import { Injectable } from '@nestjs/common';
import { GazpromRepository } from './gazprom.repository';
import { GetExistingSessionDto } from './dto/req/get-existing-session.dto';
import { ExistingSessionDto } from './dto/core/existing-session.dto';
import { GazpormErrorDto } from './dto/core/gazporm-error.dto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import {
  BAD_REQUEST_EXTERNAL_MSG,
  CONFLICT_ERROR_MSG,
  ENTITY_NOT_FOUND_MSG,
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN_EXTERNAL_MSG,
  UNAUTHORIZED_EXTERNAL_MSG,
} from '../../common/constants';
import { ExternalBadRequestException } from '../../common/exceptions/external-bad-request.exception';
import { ExternalUnauthorizedException } from '../../common/exceptions/external-unauthorized.exception';
import { ExternalForbiddenException } from '../../common/exceptions/external-forbidden.exception';
import { InternalServerErrorException } from '../../common/exceptions/internal-server-error.exception';
import { CreateGazpormClientDto } from './dto/req/create-gazporm-client.dto';
import { GazpromClientDto } from './dto/core/gazprom-client.dto';
import { ConflictErrorException } from '../../common/exceptions/conflict-error.exception';
import { GetSubscribtionStatusDto } from './dto/req/get-subscribtion-status.dto';
import { SubscribtionStatusDto } from './dto/core/subscribtion-status.dto';
import { GetSubscribtionStatusResponseDto } from './dto/res/get-subscribtion-status-response.dto';
import { SubscribtionStatus } from '../../common/enums/subscribtion-status.enum';
import { GetExistingSessionResponseDto } from './dto/res/get-existing-session-response.dto';
import { ExternalClientStatus } from '../../common/enums/external-client-status.enum';
import { CreateGazpromClientResponseDto } from './dto/res/create-gazprom-client-response.dto';

@Injectable()
export class GazpormService {
  constructor(private readonly gazpromRepository: GazpromRepository) {}

  public async getExistingSession(
    data: GetExistingSessionDto,
  ): Promise<GetExistingSessionResponseDto> {
    const { clientId } = data;
    const response: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromRepository.getExistingSession(clientId);

    console.log(response instanceof GazpormErrorDto);
    if (response instanceof GazpormErrorDto) {
      switch (response.code) {
        case 5:
          throw new EntityNotFoundException(ENTITY_NOT_FOUND_MSG);
          break;
        case 3:
          throw new ExternalBadRequestException(BAD_REQUEST_EXTERNAL_MSG);
          break;
        case 7:
          throw new ExternalUnauthorizedException(UNAUTHORIZED_EXTERNAL_MSG);
          break;
        case 16:
          throw new ExternalForbiddenException(INVALID_TOKEN_EXTERNAL_MSG);
          break;
        default:
          throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
          break;
      }
    }

    const session: GetExistingSessionResponseDto = {
      token: response.token,
      clientStatus: ExternalClientStatus.EXISTING,
    };

    return session;
  }

  public async createRegistrationSession(
    data: CreateGazpormClientDto,
  ): Promise<CreateGazpromClientResponseDto> {
    const { clientId, phone } = data;
    const request: GazpromClientDto = {
      clientId: clientId,
      phone: phone,
    };

    const response: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromRepository.createRegistrationSession(request);

    if (response instanceof GazpormErrorDto) {
      switch (response.code) {
        case 3:
          throw new ExternalBadRequestException(BAD_REQUEST_EXTERNAL_MSG);
          break;
        case 16:
          throw new ExternalForbiddenException(INVALID_TOKEN_EXTERNAL_MSG);
          break;
        case 7:
          throw new ExternalUnauthorizedException(UNAUTHORIZED_EXTERNAL_MSG);
          break;
        case 5:
          throw new EntityNotFoundException(ENTITY_NOT_FOUND_MSG);
          break;
        case 10:
          throw new ConflictErrorException(CONFLICT_ERROR_MSG);
        default:
          throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
          break;
      }
    }
    const session: CreateGazpromClientResponseDto = {
      token: response.token,
      clientStatus: ExternalClientStatus.NEW,
    };
    return session;
  }

  public async subscribtionStatusCheck(
    data: GetSubscribtionStatusDto,
  ): Promise<GetSubscribtionStatusResponseDto> {
    const { clientId } = data;
    const response: SubscribtionStatusDto | GazpormErrorDto =
      await this.gazpromRepository.getSubscriptionStatus(clientId);

    if (response instanceof GazpormErrorDto) {
      switch (response.code) {
        case 3:
          throw new ExternalBadRequestException(BAD_REQUEST_EXTERNAL_MSG);
          break;
        case 16:
          throw new ExternalForbiddenException(INVALID_TOKEN_EXTERNAL_MSG);
          break;
        case 7:
          throw new ExternalUnauthorizedException(UNAUTHORIZED_EXTERNAL_MSG);
          break;
        case 5:
          throw new EntityNotFoundException(ENTITY_NOT_FOUND_MSG);
          break;
        default:
          throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
          break;
      }
    }

    const status: GetSubscribtionStatusResponseDto =
      new GetSubscribtionStatusResponseDto();

    if (
      response.count == 1 &&
      response.items[0].status == 'USER_PROMOTION_STATUS_ACTIVE'
    ) {
      status.status = SubscribtionStatus.ACTIVE;
      status.expirationAt = response.items[0].expiration_at;
    } else {
      status.status = SubscribtionStatus.END;
      status.expirationAt = null;
    }

    return status;
  }
}
