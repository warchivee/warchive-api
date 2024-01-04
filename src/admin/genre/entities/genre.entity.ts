import { Category } from 'src/admin/category/entities/category.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'genre' })
export class Genre extends CommonEntity {
  @ManyToOne(() => Category, (category) => category.genres)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 12 })
  name: string;
}
