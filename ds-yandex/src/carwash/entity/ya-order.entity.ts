import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'YA_ORDER', synchronize: false })
export class YaOrder {
  @PrimaryGeneratedColumn({ type: 'number', name: 'ID' })
  id: number;

  @Column({ type: 'timestamp', name: 'CREATE_TIME', nullable: true })
  createTime: Date;

  @Column({ type: 'varchar2', length: 100, name: 'EXTERNAL_ID' })
  externalId: string;

  @Column({ type: 'timestamp', name: 'ORDER_TIME' })
  orderTime: Date;

  @Column({ type: 'number', name: 'BOX_NUMBER' })
  boxNumber: number;

  @Column({ type: 'number', name: 'ORDER_SUM' })
  orderSum: number;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'DESCRIPTION',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'CONTRACT_ID',
    nullable: true,
  })
  contractId: string;

  @Column({ type: 'varchar2', length: 100, name: 'STATUS', nullable: true })
  status: string;

  @Column({ type: 'number', name: 'CMNCARWASH_ID', nullable: true })
  cmnCarWashId: number;

  @Column({ type: 'number', name: 'CMNDEVICE_ID', nullable: true })
  cmnDeviceId: number;

  @Column({ type: 'timestamp', name: 'UPDATE_TIME', nullable: true })
  updateTime: Date;

  @Column({ type: 'varchar2', length: 1, name: 'SEND_STATUS', nullable: true })
  sendStatus: string;

  @Column({ type: 'timestamp', name: 'CHARGE_TIME', nullable: true })
  chargeTime: Date;

  @Column({
    type: 'varchar2',
    length: 4000,
    name: 'ERROR_REASON',
    nullable: true,
  })
  errorReason: string;

  @Column({ type: 'timestamp', name: 'SEND_TIME', nullable: true })
  sendTime: Date;

  @Column({
    type: 'varchar2',
    length: 4000,
    name: 'ERROR_EXECUTION',
    nullable: true,
  })
  errorExcecution: string;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'STATUS_EXECUTION',
    nullable: true,
  })
  statusExecution: string;
}
