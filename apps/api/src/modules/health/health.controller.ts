import { Controller, Get } from '@nestjs/common';
import { prisma } from '@tunierp/database';

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    // Quick DB ping
    let dbStatus = 'ok';
    try {
      await prisma.plan.count();
    } catch {
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tunierp-api',
      version: '1.0.0',
      database: dbStatus,
    };
  }
}
