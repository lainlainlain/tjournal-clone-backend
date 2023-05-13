import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.repository.save(createPostDto);
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async popular() {
    const qb = this.repository.createQueryBuilder();

    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.views) {
      qb.orderBy('views', dto.views);
    }

    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`);
    }

    if (dto.body) {
      qb.andWhere(`p.body ILIKE :body`);
    }

    if (dto.tags) {
      qb.andWhere(`p.tags ILIKE :tags`);
    }

    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tags: `%${dto.tags}%`,
      views: dto.views || '',
    });

    console.log(qb.getSql());

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async findOne(id: number) {
    await this.repository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({ views: () => 'views + 1' })
      .execute();

    return this.repository.findOneBy({ id });

    // if (!find) {
    //   throw new NotFoundException('Статья не найдена');
    // }

    // return find;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const find = await this.repository.findOneBy({ id });

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    return this.repository.update(id, updatePostDto);
  }

  async remove(id: number) {
    const find = await this.repository.findOneBy({ id });

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    return this.repository.delete(id);
  }
}
