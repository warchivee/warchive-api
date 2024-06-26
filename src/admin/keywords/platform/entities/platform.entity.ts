import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'platform' })
export class Platform extends CommonEntity {
  @Column({ length: 12, unique: true, collation: 'ko_KR.utf8' })
  name?: string;

  @Column({ default: false })
  order_top?: boolean;

  @Column({ nullable: true })
  domain?: string;
}
