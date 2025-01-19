import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transcription_favorites')
export class TranscriptionFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  quote_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
