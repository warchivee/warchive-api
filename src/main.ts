import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServiceExceptionsFilter } from './common/middlewere/service-exception.filter';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/middlewere/response.interceptor';
import { readFileSync } from 'fs';

async function bootstrap() {
  const serverPort = 3000;

  const app = await NestFactory.create(AppModule, {
    httpsOptions:
      process.env.NODE_ENV === 'ssl' // .ssl.env 파일 필요
        ? {
            key: readFileSync('./key.pem'),
            cert: readFileSync('./cert.pem'),
          }
        : undefined,
  });

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new ServiceExceptionsFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Warchie Api')
    .setDescription('와카이브 api 입니다')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access_token',
    )
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverPort);
}
bootstrap();
