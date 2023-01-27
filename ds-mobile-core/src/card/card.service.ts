import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Between, Repository } from 'typeorm';
import * as oracledb from 'oracledb';
import { CardBalanceResponse } from './dto/res/card-balance-response.dto';
import { CardTariffResponse } from './dto/res/card-tariff-response.dto';
import { VCardOper } from '../common/models/v-card-oper.model';
import { PaginationsOptionsInterface } from '../common/paginate/paginations-options.interface';
import * as PDFDocument from 'pdfkit';
import {
  generateCustomerInfo,
  generateReportTable,
  generateTitle,
} from './pdf/pft-file-outline';
import { CardOperationsPdfRequestDto } from './dto/req/card-operations-pdf-request.dto';
import { Card } from './model/card.model';

@Injectable()
export class CardService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(VCardOper) private vCardRepository: Repository<VCardOper>,
  ) {}

  public async getCardBalance(
    cardDevNumber: string,
  ): Promise<CardBalanceResponse> {
    const cardBalanceResponse: CardBalanceResponse = new CardBalanceResponse();

    const card = await this.cardRepository.findOne({
      select: ['balance'],
      where: {
        devNomer: cardDevNumber,
      },
    });

    return Object.assign(cardBalanceResponse, card);
  }

  public async getTransactionStatement(
    options: PaginationsOptionsInterface,
    card: string,
  ) {
    const [result, total] = await this.vCardRepository.findAndCount({
      where: { devNomer: card },
      order: { operDate: 'DESC' },
      take: options.size,
      skip: options.page,
    });

    return result;
  }

  public async getTransactionStatementPdf(
    options: PaginationsOptionsInterface,
    operationsPdfRequest: CardOperationsPdfRequestDto,
  ) {
    const { card, beginDate, endDate } = operationsPdfRequest;
    const { size, page } = options;

    const [result, total] = await this.vCardRepository.findAndCount({
      where: {
        operDate: Between(new Date(beginDate), new Date(endDate)),
        devNomer: card,
      },
      order: { operDate: 'DESC' },
      take: size,
      skip: page,
    });

    const pdf = await this.generatePdfReport(result, {
      card,
      beginDate,
      endDate,
    });

    return pdf;
  }

  private async generatePdfReport(data: any, clientInfo: any) {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
      });

      const table = {
        headers: ['Дата', 'Сумма', 'Тип', 'Автомойка', 'Пост'],
        rows: data,
      };

      generateTitle(doc, 'Детализация');
      generateCustomerInfo(doc, clientInfo);
      generateReportTable(doc, data);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  public async getCardTariff(card: string): Promise<CardTariffResponse> {
    const cardTariffResponse: CardTariffResponse = new CardTariffResponse();
    const getCardBalanceQuery = `SELECT id as "id",
       name as "name",
       code as "code",
       transfer_day as "transferDay",
       from_date as "fromDate",
       discount as "discount",
       cash_back as "cashBack",
       up_money as "needUpMoney",
       down_money as "needDownMoney",
       (SELECT nvl(sum(oper_sum), 0) oper_sum
                          FROM (SELECT oper_sum
                                  FROM cwash.cmnoper_card o 
                                 WHERE t.card_id = o.card_id
                                   AND o.oper_date >= from_date                                                                
                                 UNION ALL                                 
                                SELECT o.oper_sum
                                  FROM cwash.CRDOPER o
                                  JOIN cwash.CRDOPER_TYPE t ON o.oper_type_id = t.oper_type_id 
                                                      AND t.sign = -1
                                 WHERE CARD_ID =  t.card_id
                                   AND oper_date >= from_date
                                )
                          ) as "spentSum",
      bonus_birthday as "bonusBirthday",
      bonus_acq as "bonusAcqPerc",
      bonus_activate as "bonusActivate",
      up_type_id as "upTypeId",
      down_type_id as "downTypeId"
FROM                          
(SELECT ct.card_type_id id,
        ct.name, 
        c.card_id,       
       trunc(sysdate, 'mm') + to_number(to_char(ct.transfer_date, 'dd')) - 1 transfer_day,
       trunc(sysdate, 'mm') + to_number(to_char(ct.transfer_date, 'dd'))- 1 - ct.transfer_period from_date, 
       decode(is_discount, 0, 0, nvl(ct.discount, 0)) discount,
       decode(is_bonus, 0, 0, nvl(ct.bonus, 0)) cash_back,
       ct.up_money,       ct.down_money,
       decode(ct.is_birthday_bonus, 0, 0, nvl(ct.birthday_bonus, 0)) bonus_birthday,
       decode(ct.is_bonus_acq, 0, 0, nvl(ct.bonus_acq, 0)) bonus_acq,
       decode(ct.is_bonus_activate, 0, 0, nvl(ct.bonus_activate, 0)) bonus_activate,
       ct.up_type_id,
       ct.down_type_id,
       ct.code
FROM cwash.V_MAIN_CARD_SEARCH c
JOIN cwash.crdcard_type ct ON c.card_type_id = ct.card_type_id
LEFT JOIN (SELECT CARD_ID, MAX(DAY_DATE) HIST_DATE
             FROM cwash.CRDCARD_TYPE_HIST 
            GROUP BY CARD_ID) ld ON ld.card_id = c.card_id 
WHERE c.SEARCH_DEV_NOMER = '${card}') t`;

    const runGetCardBalance = await this.dataSource.query(getCardBalanceQuery);
    const tariff: CardTariffResponse = Object.assign(
      cardTariffResponse,
      runGetCardBalance[0],
    );

    if (tariff.needUpMoney > tariff.spentSum) {
      tariff.restUpSum = tariff.needUpMoney - tariff.spentSum;
    } else {
      tariff.restUpSum = 0;
    }

    if (tariff.spentSum < tariff.needDownMoney) {
      tariff.restDownSum = tariff.needDownMoney - tariff.spentSum;
    } else {
      tariff.spentSum = 0;
    }

    return tariff;
  }
}
