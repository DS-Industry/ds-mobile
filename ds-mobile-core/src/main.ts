import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionFilter());
  app.setGlobalPrefix('core/api/v1');
  app.use(compression());
  app.use(helmet());
  app.enable('trust proxy');

  const logger = app.get(Logger);
  await app.listen(process.env.APP_PORT, () => {
    logger.log(`App statted on port ${process.env.APP_PORT}`);
  });
}
bootstrap();
