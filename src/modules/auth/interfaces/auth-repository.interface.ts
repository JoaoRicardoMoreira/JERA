import { Role } from '@prisma/client';

import { UserEntity } from '../../users/entities/user.entity';
import { AuthSessionEntity } from '../entities/auth-session.entity';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export type CreateAuthUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  permissions: string[];
};

export type CreateRefreshTokenInput = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export interface AuthRepository {
  createUser(input: CreateAuthUserInput): Promise<UserEntity>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserById(id: string): Promise<UserEntity | null>;
  createRefreshToken(input: CreateRefreshTokenInput): Promise<AuthSessionEntity>;
  findRefreshTokenById(id: string): Promise<AuthSessionEntity | null>;
  revokeRefreshToken(id: string): Promise<void>;
}
