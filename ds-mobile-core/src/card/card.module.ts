import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './model/card.model';
import { VCardOper } from '../common/models/v-card-oper.model';
import { PromoTariff } from '../common/models/promo-tariff.model';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Card, VCardOper, PromoTariff]),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
