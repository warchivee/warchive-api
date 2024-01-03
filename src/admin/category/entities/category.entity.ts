import { Genre } from 'src/admin/genre/entities/genre.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'category' })
export class Category extends CommonEntity {
  @Column({ length: 12 })
  name: string;

  @OneToMany(() => Genre, (genre) => genre)
  genres: Genre[];
}
