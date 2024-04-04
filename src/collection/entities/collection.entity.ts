import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CollectionItem } from './collection-item.entity';

@Entity({ name: 'collection' })
export class Collection extends CommonEntity {
  @Column({ length: 50 })
  title: string;

  @Column({ length: 200, nullable: true })
  note: string;

  @OneToMany(() => CollectionItem, (item) => item.collection)
  items: CollectionItem[];
}
