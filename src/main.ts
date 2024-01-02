import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const serverPort = 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(serverPort);
}
bootstrap();
