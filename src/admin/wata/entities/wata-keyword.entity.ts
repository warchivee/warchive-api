import { CommonEntity } from 'src/common/entities/common.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Wata } from './wata.entity';
import { Keyword } from 'src/admin/keywords/keyword/entities/keyword.entity';

@Entity({ name: 'wata_keyword' })
export class WataKeywordMapping extends CommonEntity {
  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;

  @ManyToOne(() => Keyword, (keyword) => keyword.id)
  @JoinColumn({ name: 'keyword_id' })
  keyword: Keyword;
}
