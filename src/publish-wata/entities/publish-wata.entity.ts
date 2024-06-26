import { WataThumbnailCropAreaType } from 'src/admin/wata/interface/wata.type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  category?: { id: number };

  @Column({ type: 'simple-json', nullable: true })
  genre?: { id: number };

  @Column({ type: 'simple-json', nullable: true })
  keywords?: { id: number }[];

  @Column({ type: 'simple-json', nullable: true })
  cautions?: { id: number }[];

  @Column({ type: 'simple-json', nullable: true })
  platforms?: { id: number; url: string }[];

  @Column({ type: 'timestamp' })
  created_at?: Date;

  @Column({ type: 'timestamp' })
  updated_at?: Date;
}
