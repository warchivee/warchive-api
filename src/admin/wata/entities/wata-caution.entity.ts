import { CommonEntity } from 'src/common/entities/common.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Wata } from './wata.entity';
import { Caution } from 'src/admin/caution/entities/caution.entity';

@Entity({ name: 'wata_caution' })
export class WataCautionMapping extends CommonEntity {
  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;

  @ManyToOne(() => Caution, (caution) => caution.id)
  @JoinColumn({ name: 'keyword_id' })
  caution: Caution;
}
