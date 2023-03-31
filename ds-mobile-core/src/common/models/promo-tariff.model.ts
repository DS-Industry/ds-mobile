import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SubscribtionStatus } from '../enums/subscribtion-status.enum';

@Entity({ name: 'PROMO_CARD_TYPE', synchronize: false })
export class PromoTariff {
  @PrimaryGeneratedColumn({ type: 'number', name: 'ID' })
  id: number;
  @Column({ type: 'number', name: 'CARD_ID' })
  cardId: number;
  @Column({ type: 'number', name: 'PROMO_CARD_TYPE_ID', nullable: true })
  promoTariffId: number;
  @Column({ type: 'number', name: 'BASE_CARD_TYPE_ID', nullable: true })
  baseTariffId: number;
  @Column({ type: 'date', name: 'BEGIN_DATE', nullable: true })
  beginDate: Date;
  @Column({ type: 'date', name: 'END_DATE', nullable: true })
  endDate: Date;
  @Column({ type: 'varchar2', name: 'STATUS', nullable: true })
  status: SubscribtionStatus;
}
