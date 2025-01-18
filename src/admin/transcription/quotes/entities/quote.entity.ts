import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transcription_quotes')
export class TranscriptionQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}