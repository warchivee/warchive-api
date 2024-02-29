// import { CommonEntity } from 'src/common/entities/common.entity';
import { ManyToOne, JoinColumn, Entity, PrimaryColumn } from 'typeorm';
import { Collection } from './collection.entity';
import { Wata } from 'src/admin/wata/entities/wata.entity';

@Entity({ name: 'collection_item' })
export class CollectionItem {
  @PrimaryColumn()
  collection_id: number;

  @PrimaryColumn()
  wata_id: number;

  @ManyToOne(() => Collection, (collection) => collection.id)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;
}
