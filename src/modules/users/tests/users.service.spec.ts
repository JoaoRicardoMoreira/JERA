import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../entities/user.entity';
import { USERS_REPOSITORY, UserRepository } from '../interfaces/user-repository.interface';
import { UserValidator } from '../validators/user.validator';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;

  const user = new UserEntity(
    '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    'Finance User',
    'user@example.com',
    'hashed-password',
    [Role.USER],
    ['dashboard:read'],
    new Date('2026-07-03T00:00:00.000Z'),
    new Date('2026-07-03T00:00:00.000Z'),
    null,
  );

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserValidator,
        {
          provide: USERS_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should find a user by id', async () => {
    repository.findById.mockResolvedValue(user);

    await expect(service.findById(user.id)).resolves.toBe(user);
    expect(repository.findById).toHaveBeenCalledWith(user.id);
  });

  it('should find a user by email', async () => {
    repository.findByEmail.mockResolvedValue(user);

    await expect(service.findByEmail(user.email)).resolves.toBe(user);
    expect(repository.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('should return current user without sensitive fields', async () => {
    repository.findById.mockResolvedValue(user);

    const response = await service.getCurrentUser(user.id);

    expect(response).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: null,
      age: null,
      gender: null,
      phone: null,
      occupation: null,
      city: null,
      state: null,
      bio: null,
      roles: user.roles,
      permissions: user.permissions,
      createdAt: '2026-07-03T00:00:00.000Z',
      updatedAt: '2026-07-03T00:00:00.000Z',
    });
    expect(response).not.toHaveProperty('passwordHash');
  });

  it('should update and normalize the current user profile', async () => {
    repository.findById.mockResolvedValue(user);
    const updatedUser = new UserEntity(
      user.id,
      'Joao Ricardo',
      user.email,
      user.passwordHash,
      user.roles,
      user.permissions,
      user.createdAt,
      new Date('2026-07-26T12:00:00.000Z'),
      null,
      new Date('1995-08-17T00:00:00.000Z'),
      Gender.MALE,
      null,
      'Desenvolvedor',
      'Sao Paulo',
      'SP',
      'Construindo minha jornada.',
    );
    repository.updateProfile.mockResolvedValue(updatedUser);

    const response = await service.updateCurrentUser(user.id, {
      name: '  Joao Ricardo  ',
      birthDate: '1995-08-17',
      gender: Gender.MALE,
      phone: '   ',
      occupation: '  Desenvolvedor ',
      city: ' Sao Paulo ',
      state: ' SP ',
      bio: ' Construindo minha jornada. ',
    });

    expect(repository.updateProfile).toHaveBeenCalledWith(user.id, {
      name: 'Joao Ricardo',
      birthDate: new Date('1995-08-17T00:00:00.000Z'),
      gender: Gender.MALE,
      phone: null,
      occupation: 'Desenvolvedor',
      city: 'Sao Paulo',
      state: 'SP',
      bio: 'Construindo minha jornada.',
    });
    expect(response.name).toBe('Joao Ricardo');
    expect(response.age).toBeGreaterThanOrEqual(30);
  });

  it('should reject a birth date in the future', async () => {
    repository.findById.mockResolvedValue(user);

    await expect(
      service.updateCurrentUser(user.id, { birthDate: '2999-01-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.updateProfile).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(user.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
