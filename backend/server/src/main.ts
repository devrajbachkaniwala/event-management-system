import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(3001);
}
bootstrap();
