import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserMapper } from '../users/mapper/user.mapper';
import { AuthMapper } from './mapper/auth.mapper';
import {
  AuthRepository,
  CreateAuthUserInput,
  CreateRefreshTokenInput,
} from './interfaces/auth-repository.interface';
import { AuthSessionEntity } from './entities/auth-session.entity';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateAuthUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: input,
    });

    return UserMapper.toEntity(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<AuthSessionEntity> {
    const refreshToken = await this.prisma.refreshToken.create({
      data: input,
    });

    return AuthMapper.toSessionEntity(refreshToken);
  }

  async findRefreshTokenById(id: string): Promise<AuthSessionEntity | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return refreshToken ? AuthMapper.toSessionEntity(refreshToken) : null;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        id,
        deletedAt: null,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
