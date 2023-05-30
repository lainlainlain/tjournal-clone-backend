import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOneBy(cond);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(+id, updateUserDto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }

    qb.setParameters({
      email: `%${dto.email}%`,
      fullName: `%${dto.fullName}%`,
    });

    console.log(qb.getSql());

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
