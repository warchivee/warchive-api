import { Module } from '@nestjs/common';
import { WataService } from './wata.service';
import { WataController } from './wata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';
import { WataKeywordMapping } from './entities/wata-keyword.entity';
import { WataCautionMapping } from './entities/wata-caution.entity';
import { WataMappingService } from './wata-mapping.service';
import { PlatformModule } from '../keywords/platform/platform.module';
import { CautionModule } from '../keywords/caution/caution.module';
import { KeywordModule } from '../keywords/keyword/keyword.module';
import { GenreModule } from '../keywords/genre/genre.module';

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
