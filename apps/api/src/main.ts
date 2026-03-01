// ============================================================
// TuniERP API — Entry Point
// ============================================================
// Load .env BEFORE any other import so DATABASE_URL is available
// when @tunierp/database creates the PrismaClient singleton.
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '..', '..', 'packages', 'database', '.env') });

console.log('[boot] DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { bootstrapModules } from './bootstrap-modules';

async function bootstrap() {
  // Register all ERP module manifests in the in-memory registry
  bootstrapModules();

  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS — supports both local dev and Docker container networking
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [
        'http://localhost:4050',  // web (marketing)
        'http://localhost:4052',  // dashboard
        'http://localhost:3000',  // fallback
        'http://front:4050',      // Docker: front container
        'http://dashboard:4052',  // Docker: dashboard container
      ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('TuniERP API')
    .setDescription('API multi-tenant ERP pour entreprises tunisiennes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4060;
  await app.listen(port);
  console.log(`🚀 TuniERP API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
