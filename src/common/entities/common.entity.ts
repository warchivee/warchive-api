import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updater_id' })
  updater: User;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
