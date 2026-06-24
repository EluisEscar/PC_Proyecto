import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que el frontend consuma la API.
  // Acepta: orígenes configurados en CORS_ORIGIN, localhost (desarrollo)
  // y cualquier despliegue de Vercel (*.vercel.app), cuyas URLs cambian por deploy.
  const allowed =
    process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [];
  app.enableCors({
    origin: (origin, callback) => {
      // Peticiones sin origen (curl, server-to-server, health checks).
      if (!origin) return callback(null, true);
      let host = '';
      try {
        host = new URL(origin).hostname;
      } catch {
        return callback(null, false);
      }
      const ok =
        allowed.includes(origin) ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.vercel.app');
      return callback(null, ok);
    },
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
