import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
