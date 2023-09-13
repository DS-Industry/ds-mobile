import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionFilter());
  app.setGlobalPrefix('auth/api/v1');
  app.use(compression());
  app.use(helmet());
  app.enable('trust proxy');

  //Swagger set up
  const options = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME}`)
    .setBasePath('auth/api/v1/')
    .setDescription(`${process.env.APP_NAME} api`)
    .setVersion('1.0.0')
    .build();

  const logger = app.get(Logger);
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('auth/api/v1/docs', app, document);
  await app.listen(process.env.APP_PORT, () => {
    logger.log(`App statted on port ${process.env.APP_PORT}`);
  });
}
bootstrap();
