import {
  Controller,
  Get,
  Res,
  Headers,
  UseInterceptors,
  HttpCode,
  Query,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  CacheInterceptor, Post, Body,
} from '@nestjs/common';
import { CardService } from './card.service';
import { PaginationsOptionsInterface } from '../common/paginate/paginations-options.interface';
import { Response } from 'express';
import { RequestHeader } from '../common/decorators/request-header.decorator';
import { CardOperationsRequest } from './dto/req/card-operations-request.dto';
import { CardOperationsPdfRequestDto } from './dto/req/card-operations-pdf-request.dto';
import { CardHeader } from './dto/req/card-header.dto';
import { CardBalanceRequest } from './dto/req/card-balance-request.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import {CardUzbekActionDto} from "./dto/req/card-uzbek-action.dto";

@Controller('card')
@UseInterceptors(ClassSerializerInterceptor)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/balance')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Throttle(25, 60)
  public async getCardBalance(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardBalanceRequest,
    @Req() req,
  ) {
    //const { card } = query;
    const { devNomer } = req.user;
    return this.cardService.getCardBalance(devNomer);
  }

  @Get('/operations')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Throttle(10, 60)
  public async getTransactionStatement(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardOperationsRequest,
  ) {
    const { card, page, size } = query;
    const options: PaginationsOptionsInterface = {
      size,
      page,
    };
    return this.cardService.getTransactionStatement(options, card);
  }

  @Get('/operations/pdf')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Throttle(10, 60)
  public async getTransactionStatementPdf(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardOperationsPdfRequestDto,
    @Res() res: Response,
  ) {
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
  @SkipThrottle(true)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  public async getCardTariff(
    @RequestHeader(CardHeader) headers: any,
    @Query() query: CardBalanceRequest,
  ) {
    const { card } = query;
    return this.cardService.getCardTariff(card);
  }

  @Post('/uzbek/action')
  @HttpCode(201)
  public async uzbekAction(@Body() data: CardUzbekActionDto) {
    try {
      return this.cardService.uzbekAction(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}
