import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'banner' })
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 12 })
  type: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  sub_title: string;

  @Column({ nullable: true })
  intro: string;

  @Column({ nullable: true, type: 'text' })
  image: string;

  @Column({ nullable: true, type: 'text' })
  url: string;

  @Column({ length: 8, nullable: true })
  text_color: string;

  @Column({ length: 8, nullable: true })
  bg_start_color: string;

  @Column({ length: 8, nullable: true })
  bg_end_color: string;

  @Column({ length: 6, nullable: true })
  style: string;

  @Column({ length: 7, default: 'PENDING' })
  status: string;
}
