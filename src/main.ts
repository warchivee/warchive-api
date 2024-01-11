import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServiceExceptionsFilter } from './common/middlewere/exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const serverPort = 3000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ServiceExceptionsFilter());

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Warchie Api')
    .setDescription('와카이브 관리자 api 입니다')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverPort);
}
bootstrap();
