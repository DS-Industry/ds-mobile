import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException, NotFoundException,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ExternalService } from './external.service';
import { GetActiveSessionHttpRequestDto } from './dto/http/get-active-session-http-request.dto';
import { GetActiveExternalSessionDto } from './dto/req/get-active-external-session.dto';
import { ExternalBadRequestException } from '../common/exceptions/external-bad-request.exception';
import { ExternalForbiddenException } from '../common/exceptions/external-forbidden.exception';
import { ExternalUnauthorizedException } from '../common/exceptions/external-unauthorized.exception';
import { ConflictErrorException } from '../common/exceptions/conflict-error.exception';
import { ActivatePartnerPromoHttpRequestDto } from './dto/http/activate-partner-promo-http-request.dto';
import { GetExternalActivePromoDto } from './dto/req/get-external-active-promo.dto';
import { GetSubscribtionStatusHttpRequestDto } from './dto/http/get-subscribtion-status-http-request.dto';
import { GetExternalSubscribtionStatusDto } from './dto/req/get-external-subscribtion-status.dto';
import { NotAcceptableErrorException } from '../common/exceptions/not-acceptable-error.exception';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {EntityNotFoundException} from "../common/exceptions/entity-not-found.exception";

@Controller('partner')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Post('/client/session')
  @UseGuards(JwtAuthGuard)
  async getActiveSession(@Body() client: GetActiveSessionHttpRequestDto) {
    try {
      const data: GetActiveExternalSessionDto = {
        clientId: client.clientId,
        phone: client.phone,
      };
      return await this.externalService.getActiveSession(data);
    } catch (e) {
      if (e instanceof ExternalBadRequestException) {
        throw new BadRequestException(e, e.message);
      } else if (e instanceof ExternalForbiddenException) {
        throw new ForbiddenException(e, e.message);
      } else if (e instanceof ExternalUnauthorizedException) {
        throw new UnauthorizedException(e, e.message);
      } else if (e instanceof ConflictErrorException) {
        throw new ConflictException(e, e.message);
      } else {
        throw new InternalServerErrorException(e, e.message);
      }
    }
  }

  @Post('/promo/activate')
  @UseGuards(JwtAuthGuard)
  async activatePartnerPromo(
    @Body() client: ActivatePartnerPromoHttpRequestDto,
  ) {
    try {
      const data: GetExternalActivePromoDto = {
        clientId: client.clientId,
        card: client.card,
      };
      return await this.externalService.activatePromo(data);
    } catch (e) {
      if (e instanceof ExternalBadRequestException) {
        throw new BadRequestException(e, e.message);
      } else if (e instanceof ExternalForbiddenException) {
        throw new ForbiddenException(e, e.message);
      } else if (e instanceof ExternalUnauthorizedException) {
        throw new UnauthorizedException(e, e.message);
      } else if (e instanceof ConflictErrorException) {
        throw new ConflictException(e, e.message);
      } else if (e instanceof EntityNotFoundException) {
        throw new NotFoundException(e, e.message);
      } else {
        throw new InternalServerErrorException(e, e.message);
      }
    }
  }

  @Get('client/subscribtion')
  @UseGuards(JwtAuthGuard)
  async getSubscribtionStatus(
    @Query() client: GetSubscribtionStatusHttpRequestDto,
  ) {
    try {
      const data: GetExternalSubscribtionStatusDto = {
        clientId: parseInt(client.clientId),
        card: client.card,
      };
      return await this.externalService.getSubscribtionStatus(data);
    } catch (e) {
      if (e instanceof ExternalBadRequestException) {
        throw new BadRequestException(e, e.message);
      } else if (e instanceof ExternalForbiddenException) {
        throw new ForbiddenException(e, e.message);
      } else if (e instanceof ExternalUnauthorizedException) {
        throw new UnauthorizedException(e, e.message);
      } else if (e instanceof ConflictErrorException) {
        throw new ConflictException(e, e.message);
      } else if (e instanceof NotAcceptableErrorException) {
        throw new HttpException(e.message, HttpStatus.NOT_ACCEPTABLE);
      } else if (e instanceof EntityNotFoundException) {
        throw new NotFoundException(e, e.message);
    } else {
        throw new InternalServerErrorException(e, e.message);
      }
    }
  }
}
