import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ExternalService } from './external.service';
import { GetActiveSessionHttpRequestDto } from './dto/http/get-active-session-http-request.dto';
import { GetActiveExternalSessionDto } from './dto/req/get-active-external-session.dto';
import { ExternalBadRequestException } from '../common/exceptions/external-bad-request.exception';
import { ExternalForbiddenException } from '../common/exceptions/external-forbidden.exception';
import { ExternalUnauthorizedException } from '../common/exceptions/external-unauthorized.exception';
import { ConflictErrorException } from '../common/exceptions/conflict-error.exception';

@Controller('partner')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Post('/client/session')
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
}
