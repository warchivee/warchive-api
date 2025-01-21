import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transcription_quotes')
export class UserQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  author: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  translator?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  publisher?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  language: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
