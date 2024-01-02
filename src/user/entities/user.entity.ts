import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 10 })
  nickname: string;

  @Column({ type: 'bigint', unique: true })
  kakaoId: number;

  @Column({ length: 7, default: 'USER' })
  role: 'MANAGER' | 'USER';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
