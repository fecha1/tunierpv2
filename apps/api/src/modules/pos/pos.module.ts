import { Module } from '@nestjs/common';
import { POSController } from './pos.controller';

@Module({
  controllers: [POSController],
})
export class POSModule {}
