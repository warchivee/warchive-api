import { WataThumbnailCropAreaType } from 'src/admin/wata/interface/wata.type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from 'src/admin/keywords/genre/entities/genre.entity';
import { WataKeywordMapping } from 'src/admin/wata/entities/wata-keyword.entity';
import { WataCautionMapping } from 'src/admin/wata/entities/wata-caution.entity';
import { WataPlatformMapping } from 'src/admin/wata/entities/wata-platform.entity';

@Entity({ name: 'published_wata' })
export class PublishWata {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  creators?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'simple-json', nullable: true })
  thumbnail_card?: WataThumbnailCropAreaType;

  @Column({ type: 'simple-json', nullable: true })
  thumbnail_book?: WataThumbnailCropAreaType;

  @Column({ type: 'simple-json', nullable: true })
  genre?: Genre;

  @Column({ type: 'simple-json', nullable: true })
  keywords?: WataKeywordMapping[];

  @Column({ type: 'simple-json', nullable: true })
  cautions?: WataCautionMapping[];

  @Column({ type: 'simple-json', nullable: true })
  platforms?: WataPlatformMapping[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'adder_id' })
  adder?: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updater_id' })
  updater?: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
