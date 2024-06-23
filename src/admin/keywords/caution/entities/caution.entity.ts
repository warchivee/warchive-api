import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'caution' })
export class Caution extends CommonEntity {
  @Column({ length: 12, unique: true, collation: 'ko_KR.utf8' })
  name: string;

  @Column({ default: false })
  required?: boolean;
}
