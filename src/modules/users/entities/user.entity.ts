import { Gender, Role } from '@prisma/client';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly roles: Role[],
    public readonly permissions: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly birthDate: Date | null = null,
    public readonly gender: Gender | null = null,
    public readonly phone: string | null = null,
    public readonly occupation: string | null = null,
    public readonly city: string | null = null,
    public readonly state: string | null = null,
    public readonly bio: string | null = null,
  ) {}
}
