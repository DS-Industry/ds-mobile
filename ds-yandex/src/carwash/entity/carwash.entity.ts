import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

Entity({ name: 'CMNCARWASH', synchronize: false });
export class Carwash {
  @PrimaryGeneratedColumn({ type: 'number', name: 'CMNCARWASH_ID' })
  cmnCarwashId: number;

  @Column({ type: 'varchar2', name: 'NAME' })
  name: string;

  @Column({ type: 'varchar2', name: 'ADDRESS' })
  address: string;

  @Column({ type: 'number', name: 'LAT' })
  lat: number;

  @Column({ type: 'number', name: 'LON' })
  lon: number;

  @Column({ type: 'number', name: 'IS_YA' })
  isYa: number;
}
