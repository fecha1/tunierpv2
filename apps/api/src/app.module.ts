// ============================================================
// TuniERP API — Root Application Module
// ============================================================
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ModulesRegistryModule } from './modules/registry/registry.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './shared/database.module';
import { AdminModule } from './modules/admin/admin.module';

// ERP domain modules
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoicingModule } from './modules/invoicing/invoicing.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { POSModule } from './modules/pos/pos.module';

@Module({
  imports: [
    // Global config from .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../packages/database/.env', '.env'],
    }),

    // Rate limiting — default: 60 requests per minute
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 60 }]),

    // Shared Prisma client
    DatabaseModule,

    // Core modules
    HealthModule,
    AuthModule,
    TenantsModule,
    ModulesRegistryModule,
    AdminModule,

    // ERP domain modules
    InventoryModule,
    InvoicingModule,
    PurchasesModule,
    POSModule,
  ],
})
export class AppModule {}
