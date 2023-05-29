import { IsEmail, Length } from 'class-validator';

import { UserEntity } from '../entities/user.entity';
import { isUnique } from 'src/auth/validations/UniqueValidation';

export class CreateUserDto {
  @Length(3)
  fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  @isUnique(UserEntity, { always: true, message: 'Email already exists' })
  email: string;

  @Length(6, 32, { message: 'Пароль от 6 символов' })
  password?: string;
}
