import { Module } from '@nestjs/common';
import { WataService } from './wata.service';
import { WataController } from './wata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wata } from './entities/wata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wata])],
  controllers: [WataController],
  providers: [WataService],
})
export class WataModule {}
