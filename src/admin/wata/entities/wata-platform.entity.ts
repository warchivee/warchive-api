import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Wata } from './wata.entity';
import { Platform } from 'src/admin/platform/entities/platform.entity';

@Entity({ name: 'wata_platform' })
export class WataPlatformMapping extends CommonEntity {
  @ManyToOne(() => Wata, (wata) => wata.id)
  @JoinColumn({ name: 'wata_id' })
  wata: Wata;

  @ManyToOne(() => Platform, (platform) => platform.id)
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;

  @Column({ length: 250 })
  url: string;
}
