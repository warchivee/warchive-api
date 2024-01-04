import { Module } from '@nestjs/common';
import { WataService } from './wata.service';
import { WataController } from './wata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { KeywordModule } from '../keyword/keyword.module';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { CautionModule } from '../caution/caution.module';
import { GenreModule } from '../genre/genre.module';
import { PlatformModule } from '../platform/platform.module';
import { WataMappingService } from './wata-mapping.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wata, WataKeywordMapping, WataCautionMapping]),
    GenreModule,
    KeywordModule,
    CautionModule,
    PlatformModule,
  ],
  controllers: [WataController],
  providers: [WataService, WataMappingService],
})
export class WataModule {}
