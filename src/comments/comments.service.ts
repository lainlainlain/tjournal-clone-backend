import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const comment = await this.repository.save({
      text: createCommentDto.text,
      post: { id: createCommentDto.postId },
      user: { id: userId },
    });

    return this.repository.findOne({
      where: { id: comment.id },
      relations: ['user'],
    });
  }

  async findAll(postId: number) {
    const qb = this.repository.createQueryBuilder('c');

    if (postId) {
      qb.where('c.postId = :postId', { postId });
    }

    const arr = await qb
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .getMany();

    return arr.map((obj) => {
      return {
        ...obj,
        post: {
          id: obj.post.id,
          title: obj.post.title,
        },
      };
    });
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.repository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
