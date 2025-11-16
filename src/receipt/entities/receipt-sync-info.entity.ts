import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'receipt_sync_info' })
export class ReceiptSyncInfo {
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_synced_at?: Date;
}
