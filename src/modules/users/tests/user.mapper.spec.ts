import { Role } from '@prisma/client';

import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';

describe('UserMapper', () => {
  const createdAt = new Date('2026-07-01T10:00:00.000Z');
  const updatedAt = new Date('2026-07-02T10:00:00.000Z');

  it('maps a Prisma user to a domain entity', () => {
    const entity = UserMapper.toEntity({
      id: 'user-id',
      name: 'Joao',
      email: 'joao@example.com',
      passwordHash: 'hashed-password',
      roles: [Role.USER],
      permissions: ['transactions:read'],
      createdAt,
      updatedAt,
      deletedAt: null,
    });

    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity).toMatchObject({
      id: 'user-id',
      passwordHash: 'hashed-password',
      roles: [Role.USER],
      permissions: ['transactions:read'],
    });
  });

  it('maps a domain entity to a public response without passwordHash', () => {
    const response = UserMapper.toResponse(
      new UserEntity(
        'user-id',
        'Joao',
        'joao@example.com',
        'hashed-password',
        [Role.USER],
        ['transactions:read'],
        createdAt,
        updatedAt,
        null,
      ),
    );

    expect(response).toEqual({
      id: 'user-id',
      name: 'Joao',
      email: 'joao@example.com',
      birthDate: null,
      age: null,
      gender: null,
      phone: null,
      occupation: null,
      city: null,
      state: null,
      bio: null,
      roles: [Role.USER],
      permissions: ['transactions:read'],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
    expect(response).not.toHaveProperty('passwordHash');
  });
});
