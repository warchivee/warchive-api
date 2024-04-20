import { ManyToOne, JoinColumn, Entity, Index } from 'typeorm';
import { Wata } from 'src/admin/wata/entities/wata.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Scrapbook } from './scapbook.entity';

@Index(['scrapbook', 'wata'], { unique: true }) // Here
@Entity({ name: 'scrapbook_item' })
export class ScrapbookItem extends CommonEntity {
  @ManyToOne(() => Scrapbook, (scrapbook) => scrapbook.id)
  @JoinColumn({ name: 'scrapbook_id' })
  scrapbook: Scrapbook;

  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;
}
