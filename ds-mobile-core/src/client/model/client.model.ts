import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../card/model/card.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'CRDCLIENT', synchronize: false })
export class Client {
  @AutoMap()
  @PrimaryGeneratedColumn({ name: 'CLIENT_ID', type: 'number' })
  clientId: number;
  @AutoMap()
  @Column({ name: 'NAME', type: 'nvarchar2' })
  name: string;
  @AutoMap()
  @Column({ name: 'INN', type: 'nvarchar2' })
  inn: string;
  @AutoMap()
  @Column({ name: 'EMAIL', type: 'nvarchar2' })
  email: string;
  @AutoMap()
  @Column({ name: 'PHONE', type: 'nvarchar2' })
  phone: string;
  @AutoMap()
  @Column({ name: 'BIRTHDAY', type: 'date' })
  birthday: Date;
  @AutoMap()
  @Column({ name: 'INS_DATE', type: 'date' })
  insDate: Date;
  @AutoMap()
  @Column({ name: 'UPD_DATE', type: 'date' })
  updDate: Date;
  @AutoMap()
  @Column({ name: 'INS_USER_ID', type: 'number' })
  insUserId: number;
  @AutoMap()
  @Column({ name: 'UPD_USER_ID', type: 'number' })
  updUserId: number;
  @AutoMap()
  @Column({ name: 'CLIENT_TYPE_ID', type: 'number' })
  clientTypeId: number;
  @AutoMap()
  @Column({ name: 'NOTE', type: 'clob' })
  note: string;
  @AutoMap()
  @Column({ name: 'AVTO', type: 'varchar2' })
  avto: string;
  @AutoMap()
  @Column({ name: 'IS_ACTIVATED', type: 'number' })
  isActivated: number;
  @AutoMap()
  @Column({ name: 'DISCOUNT', type: 'number' })
  discount: number;
  @AutoMap()
  @Column({ name: 'GENDER_ID', type: 'number' })
  genderId: number;
  @AutoMap()
  @Column({ name: 'CORRECT_PHONE', type: 'varchar2' })
  correctPhone: string;
  @AutoMap()
  @Column({ name: 'REFRESH_TOKEN', type: 'varchar2' })
  refreshToken: string;
  @AutoMap()
  @Column({ name: 'TOKEN_ID', type: 'varchar2' })
  tokenId: string;
  @AutoMap()
  @Column({ name: 'IS_TOKEN_VALID', type: 'varchar2' })
  isTokeValid: string;
  @AutoMap()
  @Column({ name: 'ACTIVATED_DATE', type: 'date' })
  activatedDate: Date;
  @AutoMap()
  @Column({ name: 'IS_ACTIVATED_LIGHT', type: 'number' })
  isActiveLight: number;
  @AutoMap()
  @Column({ name: 'ACTIVATED_DATE_LIGHT', type: 'date' })
  activatedDateLight: Date;
  @AutoMap()
  @Column({ name: 'IS_LK', type: 'number' })
  isLk: number;
  @AutoMap()
  @Column({ name: 'TAG', type: 'varchar2' })
  tag: string;
  @AutoMap()
  @OneToMany(() => Card, (card: Card) => card.client)
  cards: Card[];
}
