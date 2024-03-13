import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { WataModule } from 'src/admin/wata/wata.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionItem]), WataModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
