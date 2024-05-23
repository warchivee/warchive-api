import { Module } from '@nestjs/common';
import { PublishWataService } from './publish-wata.service';
import { PublishWataController } from './publish-wata.controller';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsModule } from 'src/admin/keywords/keywords.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PublishWata } from './entities/publish-wata.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wata, PublishWata]),
    KeywordsModule,
    CacheModule.register(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [PublishWataController],
  providers: [
    PublishWataService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class PublishWataModule {}
