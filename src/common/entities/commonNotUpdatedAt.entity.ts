import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 모든 엔터티가 공통으로 가지는 컬럼을 정의한 Common 엔터티입니다.
 */
export class CommonNotUpdatedAtEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'adder_id' })
  adder: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updater_id' })
  updater: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
