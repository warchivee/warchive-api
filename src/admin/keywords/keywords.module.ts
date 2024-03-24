import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { CategoryModule } from './category/category.module';
import { KeywordModule } from './keyword/keyword.module';
import { CautionModule } from './caution/caution.module';
import { PlatformModule } from './platform/platform.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CategoryModule,
    KeywordModule,
    CautionModule,
    PlatformModule,
    CacheModule.register(),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
