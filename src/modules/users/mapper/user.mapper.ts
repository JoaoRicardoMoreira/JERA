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
> &
  Partial<Pick<User, 'birthDate' | 'gender' | 'phone' | 'occupation' | 'city' | 'state' | 'bio'>>;

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
      user.birthDate ?? null,
      user.gender ?? null,
      user.phone ?? null,
      user.occupation ?? null,
      user.city ?? null,
      user.state ?? null,
      user.bio ?? null,
    );
  }

  static toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate?.toISOString().slice(0, 10) ?? null,
      age: UserMapper.calculateAge(user.birthDate),
      gender: user.gender,
      phone: user.phone,
      occupation: user.occupation,
      city: user.city,
      state: user.state,
      bio: user.bio,
      roles: user.roles,
      permissions: user.permissions,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private static calculateAge(birthDate: Date | null): number | null {
    if (!birthDate) return null;

    const today = new Date();
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const hasNotHadBirthday =
      today.getUTCMonth() < birthDate.getUTCMonth() ||
      (today.getUTCMonth() === birthDate.getUTCMonth() &&
        today.getUTCDate() < birthDate.getUTCDate());

    if (hasNotHadBirthday) age -= 1;
    return age;
  }
}
