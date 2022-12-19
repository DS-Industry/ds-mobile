import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { DsCloudModule } from '../ds-cloud/ds-cloud.module';
import { OrderModule } from '@/order/order.module';

@Module({
  imports: [DsCloudModule, OrderModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
