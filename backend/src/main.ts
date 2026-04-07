import './polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const localOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = Array.from(new Set([...localOrigins, ...configuredOrigins]));

  // Enable CORS for frontend
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin is not allowed'));
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🌉 SmartBridge API running on http://localhost:${port}`);
  });
}

bootstrap();
