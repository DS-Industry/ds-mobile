import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../card/model/card.model';
import { AutoMap } from '@automapper/classes';
import {Apikey} from "./apikey.model";

@Entity({ name: 'CRDCLIENT', synchronize: false })
export class Client {
  @PrimaryGeneratedColumn({ name: 'CLIENT_ID', type: 'number' })
  clientId: number;

  @Column({ name: 'NAME', type: 'nvarchar2' })
  name: string;

  @Column({ name: 'INN', type: 'nvarchar2' })
  inn: string;

  @Column({ name: 'EMAIL', type: 'nvarchar2' })
  email: string;

  @Column({ name: 'PHONE', type: 'nvarchar2' })
  phone: string;

  @Column({ name: 'BIRTHDAY', type: 'date' })
  birthday: Date;

  @Column({ name: 'INS_DATE', type: 'date' })
  insDate: Date;

  @Column({ name: 'UPD_DATE', type: 'date' })
  updDate: Date;

  @Column({ name: 'INS_USER_ID', type: 'number' })
  insUserId: number;

  @Column({ name: 'UPD_USER_ID', type: 'number' })
  updUserId: number;

  @Column({ name: 'CLIENT_TYPE_ID', type: 'number' })
  clientTypeId: number;

  @Column({ name: 'NOTE', type: 'clob' })
  note: string;

  @Column({ name: 'AVTO', type: 'varchar2' })
  avto: string;

  @Column({ name: 'IS_ACTIVATED', type: 'number' })
  isActivated: number;

  @Column({ name: 'DISCOUNT', type: 'number' })
  discount: number;

  @Column({ name: 'GENDER_ID', type: 'number' })
  genderId: number;

  @Column({ name: 'CORRECT_PHONE', type: 'varchar2' })
  correctPhone: string;

  @Column({ name: 'REFRESH_TOKEN', type: 'varchar2' })
  refreshToken: string;

  @Column({ name: 'TOKEN_ID', type: 'varchar2' })
  tokenId: string;

  @Column({ name: 'IS_TOKEN_VALID', type: 'varchar2' })
  isTokeValid: string;

  @Column({ name: 'ACTIVATED_DATE', type: 'date' })
  activatedDate: Date;

  @Column({ name: 'IS_ACTIVATED_LIGHT', type: 'number' })
  isActiveLight: number;

  @Column({ name: 'ACTIVATED_DATE_LIGHT', type: 'date' })
  activatedDateLight: Date;

  @Column({ name: 'IS_LK', type: 'number' })
  isLk: number;

  @Column({ name: 'TAG', type: 'varchar2' })
  tag: string;

  @OneToMany(() => Card, (card: Card) => card.client)
  cards: Card[];

  @OneToMany(() => Apikey, (apiKey: Apikey) => apiKey.client)
  apiKeys: Apikey[];
}
