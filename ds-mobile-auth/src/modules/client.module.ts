import { Module } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entity/client.entity';
import { POSTGRES_DB_CONNECTION } from '../common/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Client], POSTGRES_DB_CONNECTION)],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
