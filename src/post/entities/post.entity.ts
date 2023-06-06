import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  body: OutputBlockData[];

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @Column({ nullable: true })
  tags?: string;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
