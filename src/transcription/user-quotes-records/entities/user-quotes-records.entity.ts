import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transcription_records')
export class UserQuotesRecords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  quote_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}