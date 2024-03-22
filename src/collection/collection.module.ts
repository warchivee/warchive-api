import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { Encrypt } from './collection.crypto';
import { ConfigModule } from '@nestjs/config';
import { Wata } from 'src/admin/wata/entities/wata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, CollectionItem, Wata]),
    ConfigModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService, Encrypt],
})
export class CollectionModule {}
