import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { Logtail } from '@logtail/node';
import { WinstonModule } from 'nest-winston';
import { LogtailTransport } from '@logtail/winston';

async function bootstrap() {
  const logtail = new Logtail('cH7yCqdUoPxLb7X6EoTSty91');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.use(compression());
  app.use(helmet());
  app.enable('trust proxy');
  await app.listen(process.env.PORT);
}
bootstrap();
