// ============================================================
// TuniERP API — Entry Point
// ============================================================
// Load .env BEFORE any other import so DATABASE_URL is available
// when @tunierp/database creates the PrismaClient singleton.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _dotenv = require("dotenv");
const _path = require("path");
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
const _bootstrapmodules = require("./bootstrap-modules");
(0, _dotenv.config)({
    path: (0, _path.resolve)(process.cwd(), '.env')
});
(0, _dotenv.config)({
    path: (0, _path.resolve)(process.cwd(), '..', '..', 'packages', 'database', '.env')
});
console.log('[boot] DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
async function bootstrap() {
    // Register all ERP module manifests in the in-memory registry
    (0, _bootstrapmodules.bootstrapModules)();
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Global prefix
    app.setGlobalPrefix('api/v1');
    // CORS — supports both local dev and Docker container networking
    const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
        'http://localhost:4050',
        'http://localhost:4052',
        'http://localhost:3000',
        'http://front:4050',
        'http://dashboard:4052'
    ];
    app.enableCors({
        origin: corsOrigins,
        credentials: true
    });
    // Validation pipe
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    // Swagger docs
    const config = new _swagger.DocumentBuilder().setTitle('TuniERP API').setDescription('API multi-tenant ERP pour entreprises tunisiennes').setVersion('1.0').addBearerAuth().build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.API_PORT || 4060;
    await app.listen(port);
    console.log(`🚀 TuniERP API running on http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();

//# sourceMappingURL=main.js.map