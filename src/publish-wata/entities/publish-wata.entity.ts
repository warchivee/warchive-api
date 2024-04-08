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

@Entity({ name: 'published_wata' })
export class PublishWata {
  @PrimaryColumn()
  id: number;

  @Column({ length: 250 })
  title: string;

  @Column({ length: 250, nullable: true })
  creators: string;

  @Column({ length: 250, nullable: true })
  thumbnail_card?: string;

  @Column({ length: 250, nullable: true })
  thumbnail_book?: string;

  @Column({ type: 'json', nullable: true })
  categories?: string[];

  @Column({ type: 'json', nullable: true })
  genre?: string[];

  @Column({ type: 'json', nullable: true })
  keywords?: string[];

  @Column({ type: 'json', nullable: true })
  cautions?: string[];

  @Column({ type: 'json', nullable: true })
  platforms?: string[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'adder_id' })
  adder: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updater_id' })
  updater: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
