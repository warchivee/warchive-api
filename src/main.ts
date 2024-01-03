import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const serverPort = 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

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
