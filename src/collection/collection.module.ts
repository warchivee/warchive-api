import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { WataModule } from 'src/admin/wata/wata.module';
import { Encrypt } from './collection.crypto';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, CollectionItem]),
    WataModule,
    ConfigModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService, Encrypt],
})
export class CollectionModule {}
