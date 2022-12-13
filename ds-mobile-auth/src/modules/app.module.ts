import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { BeelineService } from '../beeline/beeline.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const transportInfo: DailyRotateFile = new DailyRotateFile({
  dirname: path.join(__dirname, '../../logs'),
  filename: 'info.log',
  zippedArchive: true,
  level: 'info',
  maxSize: '20m',
  maxFiles: '7d',
});

const transportErr: DailyRotateFile = new DailyRotateFile({
  dirname: path.join(__dirname, '../../logs'),
  filename: 'error.log',
  zippedArchive: true,
  level: 'error',
  maxSize: '20m',
  maxFiles: '7d',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        transports: [
          new LogtailTransport(new Logtail(configService.get('LOGTAIL_TOKEN'))),
        ],
      }),
      inject: [ConfigService],
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
        synchronize: false,
        entities: [],
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('TTL'),
        limit: config.get<number>('LIMIT'),
      }),
    }),
    HttpModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    BeelineService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
