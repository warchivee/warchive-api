import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WataKeywordMapping } from './wata-keyword.entity';
import { WataCautionMapping } from './wata-caution.entity';
import { WataPlatformMapping } from './wata-platform.entity';
import {
  WataLabelType,
  WataThumbnailCropAreaType,
} from '../interface/wata.type';
import { Genre } from 'src/admin/keywords/genre/entities/genre.entity';
import { CommonNotUpdatedAtEntity } from 'src/common/entities/commonNotUpdatedAt.entity';

@Entity({ name: 'wata' })
export class Wata extends CommonNotUpdatedAtEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  creators?: string;

  @ManyToOne(() => Genre, (genre) => genre.id)
  @JoinColumn({ name: 'genre_id' })
  genre?: Genre;

  @OneToMany(() => WataKeywordMapping, (keyword) => keyword.wata)
  keywords?: WataKeywordMapping[];

  @OneToMany(() => WataCautionMapping, (caution) => caution.wata)
  cautions?: WataCautionMapping[];

  @OneToMany(() => WataPlatformMapping, (platform) => platform.wata)
  platforms?: WataPlatformMapping[];

  @Column({ nullable: true })
  thumbnail?: string;

  // https://orkhan.gitbook.io/typeorm/docs/entities#simple-json-column-type
  @Column({ type: 'simple-json', nullable: true })
  thumbnail_card?: WataThumbnailCropAreaType;

  // https://orkhan.gitbook.io/typeorm/docs/entities#simple-json-column-type
  @Column({ type: 'simple-json', nullable: true })
  thumbnail_book?: WataThumbnailCropAreaType;

  @Column({ length: 20, default: 'NEED_CHECK' })
  label?: WataLabelType;

  @Column({ default: false })
  is_published?: boolean;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: false, default: false })
  no_platform?: boolean;

  //is_publish 업데이트 때 적용 하지 않기 위해 별도로 분리
  @Column({ type: 'timestamp' })
  updated_at?: Date;
}
