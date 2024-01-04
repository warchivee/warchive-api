import { Genre } from 'src/admin/genre/entities/genre.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WataKeywordMapping } from './wata-keyword.entity';
import { WataCautionMapping } from './wata-caution.entity';
import { WataPlatformMapping } from './wata-platform.entity';

@Entity({ name: 'wata' })
export class Wata extends CommonEntity {
  @Column({ length: 250 })
  title: string;

  @Column({ length: 20, nullable: true })
  creators?: string;

  @ManyToOne(() => Genre, (genre) => genre.id)
  @JoinColumn({ name: 'genre_id' })
  genre?: Genre;

  @OneToMany(() => WataKeywordMapping, (keyword) => keyword.id)
  keywords?: WataKeywordMapping[];

  @OneToMany(() => WataCautionMapping, (caution) => caution.id)
  cautions?: WataCautionMapping[];

  @OneToMany(() => WataPlatformMapping, (platform) => platform.id)
  platforms?: WataPlatformMapping[];

  @Column({ length: 250, nullable: true })
  thumbnail_url?: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'adder_id' })
  adder: User;

  @Column({ length: 20, default: 'WAIT' })
  confirm_status?: 'WAIT' | 'PROGRESS' | 'COMPLETE' | 'HOLD' | 'DELETED';

  @Column({ default: false })
  is_merged?: boolean;

  @Column({ nullable: true })
  note?: string;
}
