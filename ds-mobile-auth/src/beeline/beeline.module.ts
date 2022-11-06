import { Module } from '@nestjs/common';
import { BeelineService } from './beeline.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [HttpModule, ConfigModule],
  providers: [BeelineService],
  exports: [BeelineService],
})
export class BeelineModule {}
