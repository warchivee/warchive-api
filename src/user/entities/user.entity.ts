import { CommonEntity } from 'src/common/entities/common.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'user' })
export class User extends CommonEntity {
  @Column({ length: 10 })
  nickname: string;

  @Column({ type: 'bigint', unique: true })
  kakao_id: number;

  @Column({ length: 7, default: 'USER' })
  role: 'ADMIN' | 'USER';
}
