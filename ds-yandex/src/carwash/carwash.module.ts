import { Module } from '@nestjs/common';
import { CarwashService } from './service/carwash.service';

@Module({
  controllers: [],
  providers: [CarwashService],
})
export class CarwashModule {}
