// ============================================================
// TuniERP API — Entry Point
// ============================================================
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

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:4050',  // web (marketing)
      'http://localhost:4052',  // dashboard
      'http://localhost:3000',  // fallback
    ],
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
