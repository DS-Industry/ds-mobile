import { Module } from '@nestjs/common';
import { DsCloudService } from './ds-cloud.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [DsCloudService],
  exports: [DsCloudService],
})
export class DsCloudModule {}
