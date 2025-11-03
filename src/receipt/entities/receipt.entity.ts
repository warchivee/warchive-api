import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'receipt' })
export class Receipt extends CommonEntity {
  @Column({ length: 10, nullable: true })
  date?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  rating?: string;
}
