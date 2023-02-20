import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'client' })
export class Client {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;
  @Column({ type: 'text', name: 'name', nullable: true })
  name: string;
  @Column({ type: 'text', name: 'phone', nullable: true })
  phone: string;
  @Column({ type: 'text', name: 'correct_phone', nullable: true })
  correctPhone: string;
  @Column({ type: 'text', name: 'email', nullable: true })
  email: string;
  @Column({ type: 'text', name: 'inn', nullable: true })
  inn: string;
  @Column({ type: 'bigint', name: 'gender_id', nullable: true })
  genderId: string;
  @Column({ type: 'bigint', name: 'client_type_id', nullable: true })
  clientTypeId: string;
  @Column({ type: 'timestamp', name: 'birthday', nullable: true })
  birthday: Date;
  @Column({ type: 'timestamp', name: 'inst_date', nullable: true })
  insDate: Date;
  @Column({ type: 'timestamp', name: 'up_date', nullable: true })
  updDate: Date;
  @Column({ type: 'timestamp', name: 'activated_date', nullable: true })
  activationDate: Date;
}
