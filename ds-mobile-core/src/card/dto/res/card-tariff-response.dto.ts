import { Transform } from 'class-transformer';
import { formatDate } from 'src/helper/date-format.helper';

export class CardTariffResponse {
  id: number;
  name: string;
  code: string;
  discount: number;
  cashBack: number;
  needDownMoney: number;
  needUpMoney: number;
  bonusBirthday: number;
  bonusAcqPerc: number;
  bonusActivate: number;
  upTypeId: number;
  downTypeId: number;
  @Transform(({ value }) => formatDate(new Date(value), '-'), {
    toPlainOnly: true,
  })
  transferDay: string;
  @Transform(({ value }) => formatDate(new Date(value), '-'), {
    toPlainOnly: true,
  })
  fromDate: string;
  spentSum: number;
  restUpSum: number;
  restDownSum: number;
}
