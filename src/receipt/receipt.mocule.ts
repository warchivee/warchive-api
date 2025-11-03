import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Receipt } from './entities/receipt.entity';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), ConfigModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
