import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que el front (Vercel) consuma la API.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  });

  // Validación global de DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`API escuchando en http://localhost:${port}/api`);
}
bootstrap();
