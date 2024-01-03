import { Module } from '@nestjs/common';
import { CautionService } from './caution.service';
import { CautionController } from './caution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caution } from './entities/caution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caution])],
  controllers: [CautionController],
  providers: [CautionService],
})
export class CautionModule {}
