import { RefreshToken } from '@prisma/client';

import { UserEntity } from '../../users/entities/user.entity';
import { AuthResponseDto, AuthUserResponseDto } from '../dto/auth-response.dto';
import { AuthSessionEntity } from '../entities/auth-session.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export class AuthMapper {
  static toSessionEntity(refreshToken: RefreshToken): AuthSessionEntity {
    return new AuthSessionEntity(
      refreshToken.id,
      refreshToken.userId,
      refreshToken.tokenHash,
      refreshToken.expiresAt,
      refreshToken.revokedAt,
      refreshToken.createdAt,
      refreshToken.updatedAt,
      refreshToken.deletedAt,
    );
  }

  static toJwtPayload(user: UserEntity): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };
  }

  static toAuthUserResponse(user: UserEntity): AuthUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };
  }

  static toAuthResponse(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDto {
    return {
      user: this.toAuthUserResponse(user),
      accessToken,
      refreshToken,
    };
  }
}
