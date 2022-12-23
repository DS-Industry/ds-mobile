import { Module } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogtailTransport } from '@logtail/winston';
import { YandexModule } from './yandex/yandex.module';
import { DsCloudModule } from './ds-cloud/ds-cloud.module';
import { CoreModule } from './core/core.module';
import { CarwashModule } from './carwash/carwash.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carwash } from './carwash/entity';
import { BullModule } from '@nestjs/bull';
import { OrderModule } from './order/order.module';
import { YaOrder } from '@/carwash/entity/ya-order.entity';
import { AuthModule } from './auth/auth.module';
import { BullAdminController } from "@/bull-admin/bull-admin.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        sid: configService.get('DB_SID'),
        autoLoadEntities: true,
        synchronize: false,
        entities: [YaOrder],
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    YandexModule,
    DsCloudModule,
    CoreModule,
    CarwashModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [BullAdminController],
  providers: [],
})
export class AppModule {}
