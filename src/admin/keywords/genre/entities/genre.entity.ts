import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity({ name: 'genre' })
export class Genre extends CommonEntity {
  @ManyToOne(() => Category, (category) => category.genres)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 12, unique: true })
  name: string;
}
