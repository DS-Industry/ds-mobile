import { Inject, Injectable, LoggerService, Logger } from '@nestjs/common';
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
import { UpdateStatusDto } from './dto/req/update-status.dto';
import { GazpromUpdate } from './dto/core/gazprom-update.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class GazpormService {
  private readonly logger = new Logger();
  constructor(
    private readonly gazpromRepository: GazpromRepository /*     @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService, */,
  ) {}

  public async getExistingSession(
    data: GetExistingSessionDto,
  ): Promise<GetExistingSessionResponseDto> {
    const { clientId } = data;
    //create session check if user registered with gazprom
    const response: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromRepository.getExistingSession(clientId);

    //if api returns error throw error
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

    //form response
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
    //form request data
    const request: GazpromClientDto = {
      clientId: clientId,
      phone: phone,
    };
    //register client in gazprom system
    const response: ExistingSessionDto | GazpormErrorDto =
      await this.gazpromRepository.createRegistrationSession(request);

    //if api returns error throw error
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
    //form response
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
    //get status of the client's gazprom subscribtion
    const response: SubscribtionStatusDto | GazpormErrorDto =
      await this.gazpromRepository.getSubscriptionStatus(clientId);
    //if api returns error throw error
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
    //form response
    const status: GetSubscribtionStatusResponseDto =
      new GetSubscribtionStatusResponseDto();

    if (response.count > 0) {
      status.status = SubscribtionStatus.ACTIVE;
      status.expirationAt = new Date(response.items[0].expiration_at);
    } else {
      status.status = SubscribtionStatus.END;
      status.expirationAt = null;
    }

    return status;
  }

  public async updateStatus(
    clientId: string,
    data: UpdateStatusDto,
  ): Promise<GazpromUpdate> {
    //Update gazprom status
    const response: GazpromUpdate | GazpormErrorDto =
      await this.gazpromRepository.updateStatus(clientId, data);

    //if api returns error log error
    if (response instanceof GazpormErrorDto) {
      switch (response.code) {
        case 3:
          this.logger.warn(
            `Gazprom Update Error: ${BAD_REQUEST_EXTERNAL_MSG}`,
            response,
          );
          return;
          break;
        case 16:
          this.logger.warn(
            `Gazprom Update Error: ${INVALID_TOKEN_EXTERNAL_MSG}`,
            response,
          );
          return;
          break;
        case 7:
          this.logger.warn(
            `Gazprom Update Error: ${UNAUTHORIZED_EXTERNAL_MSG}`,
            response,
          );
          return;
          break;
        case 5:
          this.logger.warn(
            `Gazprom Update Error: ${ENTITY_NOT_FOUND_MSG}`,
            response,
          );
          return;
          break;
        default:
          this.logger.error(
            `Gazprom Update Error: ${INTERNAL_SERVER_ERROR}`,
            response,
          );
          return;
          break;
      }
    }
    return response;
  }
}
