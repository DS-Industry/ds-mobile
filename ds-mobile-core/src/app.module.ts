import { CacheModule, Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { AuthModule } from './auth/auth.module';
import { PayModule } from './pay/pay.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card/model/card.model';
import { VCardOper } from './common/models/v-card-oper.model';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EquipmentModule } from './equipment/equipment.module';
import { HttpModule } from '@nestjs/axios';
import { ClientModule } from './client/client.module';
import { Client } from './client/model/client.model';
import { LoggerModule } from 'nestjs-pino';
import { Apikey } from './client/model/apikey.model';
import { ExternalModule } from './external/external.module';
import { PromoTariff } from './common/models/promo-tariff.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 2000,
      max: 300,
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
        entities: [Card, VCardOper, Client, Apikey, PromoTariff],
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
    CardModule,
    AuthModule,
    PayModule,
    EquipmentModule,
    HttpModule,
    ClientModule,
    ExternalModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp:
          process.env.NODE_ENV === 'development'
            ? {
                serializers: {
                  req(req) {
                    req.body = req.raw.body;
                    return req;
                  },
                },
                transport: {
                  dedupe: true,
                  targets: [
                    {
                      target: 'pino-pretty',
                      options: {
                        levelFirst: true,
                        translateTime: 'SYS:dd/mm/yyyy, h:MM:ss.l o',
                      },
                      level: 'info',
                    },
                  ],
                },
              }
            : {
                customSuccessMessage(req, res) {
                  return `${req.method} [${req.url}] || ${res.statusMessage}`;
                },
                customErrorMessage(req, res, error) {
                  return `${req.method} [${req.url}] || ${error.message}`;
                },
                serializers: {
                  req(req) {
                    req.body = req.raw.body;
                    return req;
                  },
                },
                transport: {
                  dedupe: true,
                  targets: [
                    {
                      target: '@logtail/pino',
                      options: {
                        sourceToken: config.get('LOGTAIL_TOKEN_INFO'),
                      },
                      level: 'info',
                    },
                    {
                      target: '@logtail/pino',
                      options: { sourceToken: config.get('LOGTAIL_TOKEN') },
                      level: 'error',
                    },
                  ],
                },
              },
      }),
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
