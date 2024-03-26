import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { CategoryModule } from './category/category.module';
import { KeywordModule } from './keyword/keyword.module';
import { CautionModule } from './caution/caution.module';
import { PlatformModule } from './platform/platform.module';
import { CacheModule } from '@nestjs/cache-manager';
import { WataPlatformMapping } from '../wata/entities/wata-platform.entity';
import { WataKeywordMapping } from '../wata/entities/wata-keyword.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([WataPlatformMapping, WataKeywordMapping]),
    CategoryModule,
    KeywordModule,
    CautionModule,
    PlatformModule,
    CacheModule.register(),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService],
  exports: [KeywordsService],
})
export class KeywordsModule {}
