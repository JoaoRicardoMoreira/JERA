import { Role, User } from '@prisma/client';

import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/user.entity';

type PrismaUser = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'passwordHash'
  | 'roles'
  | 'permissions'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

export class UserMapper {
  static toEntity(user: PrismaUser): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.roles as Role[],
      user.permissions,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }

  static toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
