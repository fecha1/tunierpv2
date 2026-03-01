import { Module } from '@nestjs/common';
import { InvoicingController } from './invoicing.controller';

@Module({
  controllers: [InvoicingController],
})
export class InvoicingModule {}
