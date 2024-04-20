import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ScrapbookItem } from './scapbook-item.entity';

@Entity({ name: 'scrapbook' })
export class Scrapbook extends CommonEntity {
  @Column({ length: 20 })
  title: string;

  @Column({ length: 100, nullable: true })
  note: string;

  @OneToMany(() => ScrapbookItem, (item) => item.scrapbook)
  items: ScrapbookItem[];
}
