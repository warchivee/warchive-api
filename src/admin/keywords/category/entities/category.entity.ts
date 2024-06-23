import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';

@Entity({ name: 'category' })
export class Category extends CommonEntity {
  @Column({ length: 12, unique: true, collation: 'ko_KR.utf8' })
  name: string;

  @OneToMany(() => Genre, (genre) => genre.category)
  genres: Genre[];
}
