import { Role } from '@prisma/client';

import { DEFAULT_CATEGORIES } from '../../categories/default-categories';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaAuthRepository } from '../auth.repository';

describe('PrismaAuthRepository', () => {
  it('should create the default categories together with a new user', async () => {
    const now = new Date('2026-07-26T00:00:00.000Z');
    const prisma = {
      user: {
        create: jest.fn().mockResolvedValue({
          id: '8b156bc1-8478-4663-b171-ef73c77b4b99',
          name: 'Finance User',
          email: 'user@example.com',
          passwordHash: 'hashed-password',
          roles: [Role.USER],
          permissions: ['dashboard:read'],
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        }),
      },
    };
    const repository = new PrismaAuthRepository(prisma as unknown as PrismaService);

    await repository.createUser({
      name: 'Finance User',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      roles: [Role.USER],
      permissions: ['dashboard:read'],
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'user@example.com',
        categories: {
          create: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
        },
      }),
    });
  });
});
