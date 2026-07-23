import { Injectable, NotFoundException } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserValidator {
  ensureExists(user: UserEntity | null): UserEntity {
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario nao encontrado.',
      });
    }

    return user;
  }
}
