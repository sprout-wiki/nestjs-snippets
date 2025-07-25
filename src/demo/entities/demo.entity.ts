import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Demo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;
}
