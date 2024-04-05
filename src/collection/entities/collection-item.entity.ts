import { ManyToOne, JoinColumn, Entity, Index } from 'typeorm';
import { Collection } from './collection.entity';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Index(['collection', 'wata'], { unique: true }) // Here
@Entity({ name: 'collection_item' })
export class CollectionItem extends CommonEntity {
  @ManyToOne(() => Collection, (collection) => collection.id)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;
}
