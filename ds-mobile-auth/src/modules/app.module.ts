import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import * as path from 'path';
import * as fs from 'fs';
import { Client } from '../entity/client.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientModule } from './client.module';
import { POSTGRES_DB_CONNECTION } from '../common/utils/constants';
import { AuthModule } from './auth.module';
import { BeelineModule } from '../beeline/beeline.module';
//import { LogInterceptor } from '../common/interceptor/log.interceptor';
import { LoggerModule } from 'nestjs-pino';

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
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      name: POSTGRES_DB_CONNECTION,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: POSTGRES_DB_CONNECTION,
        type: 'postgres',
        host: configService.get('PSQL_HOST'),
        port: configService.get('PSQL_PORT'),
        username: configService.get('PSQL_USERNAME'),
        password: configService.get('PSQL_PASSWORD'),
        database: configService.get('PSQL_DB_NAME'),
        synchronize: false,
        ssl: {
          ca: fs
            .readFileSync(path.join(__dirname, '..', '..', 'ssl', 'root.crt'))
            .toString(),
        },
        entities: [Client],
        migrations: [],
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
    ClientModule,
    AuthModule,
    BeelineModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          serializers: {
            req(req) {
              req.body = req.raw.body;
              return req;
            },
          },
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                options: {
                  levelFirst: true,
                  translateTime: 'SYS:dd/mm/yyyy, h:MM:ss.l o',
                },
                level: 'info',
              },
              {
                target: '@logtail/pino',
                options: { sourceToken: config.get('LOGTAIL_TOKEN') },
                level: 'info',
              },
            ],
          },
        },
      }),
    }),
    /*  LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req(req) {
            req.body = req.raw.body;
            return req;
          },
        },
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                levelFirst: true,
                translateTime: 'SYS:dd/mm/yyyy, h:MM:ss.l o',
                ingore: 'req,res',
              },
              level: 'info',
            },
                      {
              target: '@logtail/pino',
              options: { sourceToken: configService.get('LOGTAIL_TOKEN') },
              level: 'info',
            } 
          ],
        },
      },
    }), */
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    /*     {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    }, */
  ],
})
export class AppModule {}
