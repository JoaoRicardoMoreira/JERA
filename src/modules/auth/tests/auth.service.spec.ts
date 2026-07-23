import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../../users/entities/user.entity';
import { AuthSessionEntity } from '../entities/auth-session.entity';
import { DEFAULT_USER_PERMISSIONS } from '../entities/permission.enum';
import { AuthRepository } from '../interfaces/auth-repository.interface';
import { AuthValidator } from '../validators/auth.validator';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<AuthRepository>;
  let jwtService: { signAsync: jest.Mock };
  let configService: { getOrThrow: jest.Mock };

  const now = new Date('2026-07-03T00:00:00.000Z');
  const user = new UserEntity(
    '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    'Finance User',
    'user@example.com',
    'hashed-password',
    [Role.USER],
    ['dashboard:read'],
    now,
    now,
    null,
  );

  beforeEach(() => {
    repository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      createRefreshToken: jest.fn(),
      findRefreshTokenById: jest.fn(),
      revokeRefreshToken: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('access-token'),
    };

    configService = {
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string | number> = {
          'jwt.accessSecret': 'test-access-secret',
          'jwt.accessExpiresIn': '15m',
          'jwt.refreshExpiresIn': '7d',
          BCRYPT_SALT_ROUNDS: 10,
        };

        return values[key];
      }),
    };

    repository.createRefreshToken.mockImplementation(async (input) => {
      return new AuthSessionEntity(
        input.id,
        input.userId,
        input.tokenHash,
        input.expiresAt,
        null,
        now,
        now,
        null,
      );
    });

    service = new AuthService(
      repository,
      new AuthValidator(),
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('should register a user and return tokens without persisting raw secrets', async () => {
    repository.findUserByEmail.mockResolvedValue(null);
    repository.createUser.mockResolvedValue(user);

    const response = await service.register({
      name: ' Finance User ',
      email: 'USER@example.com',
      password: 'StrongPass123',
    });

    expect(repository.findUserByEmail).toHaveBeenCalledWith('user@example.com');
    expect(repository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Finance User',
        email: 'user@example.com',
        roles: [Role.USER],
        permissions: DEFAULT_USER_PERMISSIONS,
      }),
    );
    expect(repository.createUser.mock.calls[0][0].passwordHash).not.toBe('StrongPass123');
    expect(response).toEqual(
      expect.objectContaining({
        accessToken: 'access-token',
        user: expect.objectContaining({ id: user.id, email: user.email }),
      }),
    );
    expect(repository.createRefreshToken.mock.calls[0][0].tokenHash).not.toContain(
      response.refreshToken,
    );
  });

  it('should reject duplicated email on register', async () => {
    repository.findUserByEmail.mockResolvedValue(user);

    await expect(
      service.register({
        name: 'Finance User',
        email: user.email,
        password: 'StrongPass123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should login with valid credentials', async () => {
    const passwordHash = await bcrypt.hash('StrongPass123', 10);
    repository.findUserByEmail.mockResolvedValue(
      new UserEntity(
        user.id,
        user.name,
        user.email,
        passwordHash,
        user.roles,
        user.permissions,
        user.createdAt,
        user.updatedAt,
        user.deletedAt,
      ),
    );

    const response = await service.login({
      email: user.email,
      password: 'StrongPass123',
    });

    expect(response.accessToken).toBe('access-token');
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      },
      expect.objectContaining({
        secret: 'test-access-secret',
        expiresIn: '15m',
      }),
    );
  });

  it('should reject invalid login credentials', async () => {
    repository.findUserByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: user.email,
        password: 'StrongPass123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should rotate refresh token', async () => {
    const tokenId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';
    const tokenSecret = 'a'.repeat(96);
    const tokenHash = await bcrypt.hash(tokenSecret, 10);
    const refreshToken = `${tokenId}.${tokenSecret}`;

    repository.findRefreshTokenById.mockResolvedValue(
      new AuthSessionEntity(
        tokenId,
        user.id,
        tokenHash,
        new Date(Date.now() + 60_000),
        null,
        now,
        now,
        null,
      ),
    );
    repository.findUserById.mockResolvedValue(user);

    const response = await service.refresh({ refreshToken });

    expect(repository.findRefreshTokenById).toHaveBeenCalledWith(tokenId);
    expect(repository.revokeRefreshToken).toHaveBeenCalledWith(tokenId);
    expect(repository.createRefreshToken).toHaveBeenCalledTimes(1);
    expect(response.refreshToken).not.toBe(refreshToken);
  });

  it('should revoke refresh token on logout', async () => {
    const tokenId = '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67';

    await service.logout({
      refreshToken: `${tokenId}.${'a'.repeat(96)}`,
    });

    expect(repository.revokeRefreshToken).toHaveBeenCalledWith(tokenId);
  });
});
