import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'collection' })
export class Collection extends CommonEntity {
  @Column({ length: 50 })
  title: string;

  @Column({ length: 200 })
  note: string;
}
