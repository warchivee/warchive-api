import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WataKeywordMapping } from './wata-keyword.entity';
import { WataCautionMapping } from './wata-caution.entity';
import { WataPlatformMapping } from './wata-platform.entity';
import { WataLabelType } from '../interface/wata.type';
import { Genre } from 'src/admin/keywords/genre/entities/genre.entity';

@Entity({ name: 'wata' })
export class Wata extends CommonEntity {
  @Column({ length: 250 })
  title: string;

  @Column({ length: 250, nullable: true })
  creators: string;

  @ManyToOne(() => Genre, (genre) => genre.id)
  @JoinColumn({ name: 'genre_id' })
  genre?: Genre;

  @OneToMany(() => WataKeywordMapping, (keyword) => keyword.wata)
  keywords?: WataKeywordMapping[];

  @OneToMany(() => WataCautionMapping, (caution) => caution.wata)
  cautions?: WataCautionMapping[];

  @OneToMany(() => WataPlatformMapping, (platform) => platform.wata)
  platforms?: WataPlatformMapping[];

  @Column({ length: 250, nullable: true })
  thumbnail_card?: string;

  @Column({ length: 250, nullable: true })
  thumbnail_book?: string;

  @Column({ length: 20, default: 'NEED_CHECK' })
  label?: WataLabelType;

  @Column({ default: false })
  is_published?: boolean;

  @Column({ nullable: true })
  note?: string;
}
