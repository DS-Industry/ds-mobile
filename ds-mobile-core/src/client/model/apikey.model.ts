import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.model';

@Entity({ name: 'MOBILE_API_KEY', synchronize: false })
export class Apikey {
  @PrimaryGeneratedColumn({ name: 'KEY_ID' })
  keyId: number;
  @Column({ name: 'API_KEY', type: 'varchar2' })
  apiKey: string;
  @Column({ name: 'EXPIRATION', type: 'date', nullable: true })
  expiration: Date;
  @ManyToOne(() => Client, (client: Client) => client.apiKeys)
  @JoinColumn({ name: 'CLIENT_ID' })
  client: Client;
}
