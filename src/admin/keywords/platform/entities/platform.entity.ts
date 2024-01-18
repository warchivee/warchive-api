import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'platform' })
export class Platform extends CommonEntity {
  @Column({ length: 12, unique: true })
  name?: string;
}
