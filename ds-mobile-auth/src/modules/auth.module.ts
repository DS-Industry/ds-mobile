import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BeelineModule } from '../beeline/beeline.module';
import { ClientModule } from './client.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    BeelineModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
