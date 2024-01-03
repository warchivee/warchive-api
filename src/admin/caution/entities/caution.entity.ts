import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'caution' })
export class Caution extends CommonEntity {
  @Column({ length: 12 })
  name: string;
}
