import { Module } from '@nestjs/common';
import { CarwashService } from './service/carwash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YaOrder } from '@/carwash/entity/ya-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YaOrder])],
  providers: [CarwashService],
  exports: [CarwashService],
})
export class CarwashModule {}
