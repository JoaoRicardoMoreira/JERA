import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './interfaces/user-repository.interface';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UsersRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }
}
