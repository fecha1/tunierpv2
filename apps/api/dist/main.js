"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================================
// TuniERP API — Entry Point
// ============================================================
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const bootstrap_modules_1 = require("./bootstrap-modules");
async function bootstrap() {
    // Register all ERP module manifests in the in-memory registry
    (0, bootstrap_modules_1.bootstrapModules)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global prefix
    app.setGlobalPrefix('api/v1');
    // CORS
    app.enableCors({
        origin: [
            'http://localhost:4050', // web (marketing)
            'http://localhost:4052', // dashboard
            'http://localhost:3000', // fallback
        ],
        credentials: true,
    });
    // Validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    // Swagger docs
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TuniERP API')
        .setDescription('API multi-tenant ERP pour entreprises tunisiennes')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.API_PORT || 4060;
    await app.listen(port);
    console.log(`🚀 TuniERP API running on http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map