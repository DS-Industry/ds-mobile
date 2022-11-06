import {
  Controller,
  Get,
  Res,
  Headers,
  UseInterceptors,
  HttpCode,
  Query,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CardService } from './card.service';
import { AuthService } from '../auth/auth.service';
import { PaginationsOptionsInterface } from '../common/paginate/paginations-options.interface';
import { Response } from 'express';
import { RequestHeader } from '../common/decorators/request-header.decorator';
import { CardOperationsRequest } from './dto/req/card-operations-request.dto';
import { CardOperationsPdfRequestDto } from './dto/req/card-operations-pdf-request.dto';
import { CardHeader } from './dto/req/card-header.dto';
import { CardBalanceRequest } from './dto/req/card-balance-request.dto';

@Controller('card')
@UseInterceptors(ClassSerializerInterceptor)
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly authService: AuthService,
  ) {}

  @Get('/balance')
  @HttpCode(200)
  public async getCardBalance(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardBalanceRequest,
  ) {
    const { accessToken } = headers;
    const { card } = query;
    await this.authService.verifyAccessToken(card, accessToken);
    return this.cardService.getCardBalance(card);
  }

  @Get('/operations')
  @HttpCode(200)
  public async getTransactionStatement(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardOperationsRequest,
  ) {
    const { accessToken } = headers;
    const { card, page, size } = query;
    const options: PaginationsOptionsInterface = {
      size,
      page,
    };
    await this.authService.verifyAccessToken(card, accessToken);
    return this.cardService.getTransactionStatement(options, card);
  }

  @Get('/operations/pdf')
  @HttpCode(200)
  public async getTransactionStatementPdf(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardOperationsPdfRequestDto,
    @Res() res: Response,
  ) {
    const { accessToken } = headers;
    const { card } = query;
    await this.authService.verifyAccessToken(card, accessToken);

    const buffer = await this.cardService.getTransactionStatementPdf(
      { size: 1000, page: 0 },
      query,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=operations.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('/tariff')
  @HttpCode(200)
  public async getCardTariff(@RequestHeader(CardHeader) headers: any, @Query() query: CardBalanceRequest) {
    const { accessToken } = headers;
    const { card } = query;
    await this.authService.verifyAccessToken(card, accessToken);
    return this.cardService.getCardTariff(card);
  }
}
