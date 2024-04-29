import { Module } from '@nestjs/common';
import { CautionService } from './caution.service';
import { CautionController } from './caution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caution } from './entities/caution.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Caution]), CacheModule.register()],
  controllers: [CautionController],
  providers: [CautionService],
  exports: [CautionService],
})
export class CautionModule {}
