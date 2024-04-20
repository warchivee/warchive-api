import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { ScrapbookItem } from './entities/scapbook-item.entity';
import { Scrapbook } from './entities/scapbook.entity';
import { ScrapbookController } from './scapbook.controller';
import { ScrapbookService } from './scapbook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scrapbook, ScrapbookItem, Wata]),
    ConfigModule,
  ],
  controllers: [ScrapbookController],
  providers: [ScrapbookService],
  exports: [ScrapbookService],
})
export class ScrapbookModule {}
