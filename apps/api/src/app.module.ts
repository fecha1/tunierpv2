// ============================================================
// TuniERP API — Root Application Module
// ============================================================
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ModulesRegistryModule } from './modules/registry/registry.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './shared/database.module';

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

    // Shared Prisma client
    DatabaseModule,

    // Core modules
    HealthModule,
    AuthModule,
    TenantsModule,
    ModulesRegistryModule,

    // ERP domain modules
    InventoryModule,
    InvoicingModule,
    PurchasesModule,
    POSModule,
  ],
})
export class AppModule {}
