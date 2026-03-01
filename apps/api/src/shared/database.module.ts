// ============================================================
// Shared — Database Module (Prisma singleton for DI)
// ============================================================
import { Module, Global } from '@nestjs/common';
import { prisma } from '@tunierp/database';

export const PRISMA_TOKEN = 'PRISMA_SERVICE';

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_TOKEN,
      useValue: prisma,
    },
  ],
  exports: [PRISMA_TOKEN],
})
export class DatabaseModule {}
