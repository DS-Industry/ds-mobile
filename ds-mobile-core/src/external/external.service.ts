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
import { GetSubscribtionStatusResponseDto } from './gazporm/dto/res/get-subscribtion-status-response.dto';
import { SubscribtionStatus } from '../common/enums/subscribtion-status.enum';
import {
  ENTITY_NOT_FOUND_MSG,
  NOT_ACCEPTABLE_ERROR_MSG,
} from '../common/constants';
import { CardService } from '../card/card.service';
import { Card } from '../card/model/card.model';
import { UpdateCardRequestDto } from '../card/dto/req/update-card-request.dto';
import { GetExternalActivePromoDto } from './dto/req/get-external-active-promo.dto';
import { GetExternalActivePromoResponseDto } from './dto/res/get-external-active-promo-response.dto';
import { NotAcceptableErrorException } from '../common/exceptions/not-acceptable-error.exception';
import { GetExternalSubscribtionStatusDto } from './dto/req/get-external-subscribtion-status.dto';
import { GetExternalSubscribtionResponseDto } from './dto/res/get-external-subscribtion-response.dto';
import { UpdateStatusDto } from './gazporm/dto/req/update-status.dto';
import * as moment from 'moment';

@Injectable()
export class ExternalService {
  private readonly ognTariffId = 2046;
  constructor(
    private readonly gazpromService: GazpormService,
    private readonly cardService: CardService,
  ) {}

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
        token: existingSession.token,
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
      token: newSession.token,
    };
    return response;
  }

  public async activatePromo(
    data: GetExternalActivePromoDto,
  ): Promise<GetExternalActivePromoResponseDto> {
    //check sub status
    const staus: GetSubscribtionStatusResponseDto =
      await this.gazpromService.subscribtionStatusCheck({
        clientId: data.clientId.toString(),
      });

    if (staus.status == SubscribtionStatus.END)
      throw new EntityNotFoundException(ENTITY_NOT_FOUND_MSG);

    const cardUpdateData: UpdateCardRequestDto = {
      cardTypeId: this.ognTariffId,
    };

    // if active change tariff
    await this.cardService.upgradeCardPromo(data.card, this.ognTariffId);

    const date: Date = new Date(Date.now());

    const updateData: UpdateStatusDto = {
      meta: {
        cashback_discount: '25',
        cashback_discount_expires_at: moment(date).format('YYYY-MM-DD'),
        offer_status: SubscribtionStatus.ACTIVE,
      },
    };

    await this.gazpromService.updateStatus(
      data.clientId.toString(),
      updateData,
    );

    const response: GetExternalActivePromoResponseDto = {
      promoStatus: SubscribtionStatus.ACTIVE,
      promoTariff: true,
    };

    return response;
  }

  public async getSubscribtionStatus(
    data: GetExternalSubscribtionStatusDto,
  ): Promise<GetExternalSubscribtionResponseDto> {
    const card: Card = await this.cardService.findOneByDevNomer(data.card);

    if (card.cardTypeId != this.ognTariffId)
      throw new NotAcceptableErrorException(NOT_ACCEPTABLE_ERROR_MSG);

    //Check subscribtion status
    const staus: GetSubscribtionStatusResponseDto =
      await this.gazpromService.subscribtionStatusCheck({
        clientId: data.clientId.toString(),
      });

    const response: GetExternalSubscribtionResponseDto = {
      promoStatus: staus.status,
    };

    if (staus.status == SubscribtionStatus.ACTIVE) {
      response.promoTariff = true;
      return response;
    }

    //downgrade tarrif;
    await this.cardService.downgradeCardPromo(data.card);

    response.promoTariff = false;
    return response;
  }
}
