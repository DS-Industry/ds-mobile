import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './model/client.model';
import { Apikey } from './model/apikey.model';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Apikey])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
