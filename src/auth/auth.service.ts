import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByCond({ email, password });
    if (user && user.password === password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
