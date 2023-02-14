import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';
import { ConfigModule } from '@nestjs/config';
import { GazpormService } from './gazporm/gazporm.service';
import { HttpModule } from '@nestjs/axios';
import { GazpromRepository } from './gazporm/gazprom.repository';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ExternalController],
  providers: [ExternalService, GazpormService, GazpromRepository],
})
export class ExternalModule {}
