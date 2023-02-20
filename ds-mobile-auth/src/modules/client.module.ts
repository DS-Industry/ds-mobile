import { Module } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entity/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
