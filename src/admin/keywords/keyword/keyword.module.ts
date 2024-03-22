import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword]), CacheModule.register()],
  controllers: [KeywordController],
  providers: [KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}
