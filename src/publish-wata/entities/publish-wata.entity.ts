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
import { InfoDto, PlatformInfoDto } from '../dto/save-publish.dto';

@Entity({ name: 'published_wata' })
export class PublishWata {
  @PrimaryColumn()
  id: number;

  @Column({ length: 250, nullable: true })
  title?: string;

  @Column({ length: 250, nullable: true })
  creators?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'simple-json', nullable: true })
  thumbnail_card?: WataThumbnailCropAreaType;

  @Column({ type: 'simple-json', nullable: true })
  thumbnail_book?: WataThumbnailCropAreaType;

//   @Column({ type: 'json', nullable: true })
//   genre?: string[];

//   @Column({ type: 'json', nullable: true })
//   keywords?: string[];

//   @Column({ type: 'json', nullable: true })
//   cautions?: string[];

//   @Column({ type: 'json', nullable: true })
//   platforms?: string[];

  @Column({ type: 'simple-json', nullable: true })
  genre?: InfoDto;

  @Column({ type: 'simple-json', nullable: true })
  keywords?: InfoDto;

  @Column({ type: 'simple-json', nullable: true })
  cautions?: InfoDto;

  @Column({ type: 'simple-json', nullable: true })
  platforms?: PlatformInfoDto;

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
