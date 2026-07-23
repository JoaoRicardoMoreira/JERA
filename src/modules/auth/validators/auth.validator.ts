import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UserEntity } from '../../users/entities/user.entity';
import { AuthSessionEntity } from '../entities/auth-session.entity';

@Injectable()
export class AuthValidator {
  ensureEmailAvailable(user: UserEntity | null): void {
    if (user) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email ja cadastrado.',
      });
    }
  }

  ensureValidCredentials(isValid: boolean): void {
    if (!isValid) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha invalidos.',
      });
    }
  }

  ensureRefreshSession(session: AuthSessionEntity | null): AuthSessionEntity {
    if (!session || session.deletedAt || session.isRevoked) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token invalido.',
      });
    }

    if (session.isExpired) {
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'Refresh token expirado.',
      });
    }

    return session;
  }

  ensureRefreshTokenFormat(parts: string[]): void {
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new UnprocessableEntityException({
        code: 'INVALID_REFRESH_TOKEN_FORMAT',
        message: 'Formato de refresh token invalido.',
      });
    }
  }
}
