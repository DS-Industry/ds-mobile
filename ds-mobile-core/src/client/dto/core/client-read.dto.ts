import { AutoMap } from '@automapper/classes';
import { Column, OneToMany } from 'typeorm';
import { Card } from '../../../card/model/card.model';

export class ClientReadDto {
  @AutoMap()
  clientId: number;
  @AutoMap()
  name: string;
  @AutoMap()
  inn: string;
  @AutoMap()
  email: string;
  @AutoMap()
  phone: string;
  @AutoMap()
  birthday: Date;
  @AutoMap()
  insDate: Date;
  @AutoMap()
  updDate: Date;
  @AutoMap()
  insUserId: number;
  @AutoMap()
  updUserId: number;
  @AutoMap()
  clientTypeId: number;
  @AutoMap()
  note: string;
  @AutoMap()
  avto: string;
  @AutoMap()
  isActivated: number;
  @AutoMap()
  discount: number;
  @AutoMap()
  genderId: number;
  @AutoMap()
  correctPhone: string;
  @AutoMap()
  refreshToken: string;
  @AutoMap()
  tokenId: string;
  @AutoMap()
  isTokeValid: string;
  @AutoMap()
  activatedDate: Date;
  @AutoMap()
  isActiveLight: number;
  @AutoMap()
  activatedDateLight: Date;
  @AutoMap()
  isLk: number;
  @AutoMap()
  tag: string;
  @AutoMap()
  cards: Card[];
}
