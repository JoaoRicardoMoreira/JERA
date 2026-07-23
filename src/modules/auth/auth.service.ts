import { randomBytes, randomUUID } from 'crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../users/entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { DEFAULT_USER_PERMISSIONS } from './entities/permission.enum';
import { Role } from './entities/role.enum';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AUTH_REPOSITORY, AuthRepository } from './interfaces/auth-repository.interface';
import { AuthMapper } from './mapper/auth.mapper';
import { AuthValidator } from './validators/auth.validator';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    private readonly authValidator: AuthValidator,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.authRepository.findUserByEmail(email);
    this.authValidator.ensureEmailAvailable(existingUser);

    const passwordHash = await this.hashSecret(dto.password);
    const user = await this.authRepository.createUser({
      name: dto.name.trim(),
      email,
      passwordHash,
      roles: [Role.USER],
      permissions: [...DEFAULT_USER_PERMISSIONS],
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.authRepository.findUserByEmail(email);
    this.authValidator.ensureValidCredentials(Boolean(user));

    const isPasswordValid = await bcrypt.compare(dto.password, user?.passwordHash ?? '');
    this.authValidator.ensureValidCredentials(isPasswordValid);

    return this.createAuthResponse(user as UserEntity);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { tokenId, tokenSecret } = this.parseRefreshToken(dto.refreshToken);
    const session = this.authValidator.ensureRefreshSession(
      await this.authRepository.findRefreshTokenById(tokenId),
    );

    const isTokenValid = await bcrypt.compare(tokenSecret, session.tokenHash);
    if (!isTokenValid) {
      await this.authRepository.revokeRefreshToken(session.id);
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token invalido.',
      });
    }

    const user = await this.authRepository.findUserById(session.userId);
    this.authValidator.ensureValidCredentials(Boolean(user));

    await this.authRepository.revokeRefreshToken(session.id);

    return this.createAuthResponse(user as UserEntity);
  }

  async logout(dto: RefreshTokenDto): Promise<void> {
    const { tokenId } = this.parseRefreshToken(dto.refreshToken);
    await this.authRepository.revokeRefreshToken(tokenId);
  }

  private async createAuthResponse(user: UserEntity): Promise<AuthResponseDto> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  private async createAccessToken(user: UserEntity): Promise<string> {
    const expiresIn = this.configService.getOrThrow<string>(
      'jwt.accessExpiresIn',
    ) as JwtSignOptions['expiresIn'];

    return this.jwtService.signAsync(AuthMapper.toJwtPayload(user), {
      secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
      expiresIn,
    });
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const tokenId = randomUUID();
    const tokenSecret = randomBytes(48).toString('hex');
    const tokenHash = await this.hashSecret(tokenSecret);

    await this.authRepository.createRefreshToken({
      id: tokenId,
      userId,
      tokenHash,
      expiresAt: this.getRefreshTokenExpirationDate(),
    });

    return `${tokenId}.${tokenSecret}`;
  }

  private parseRefreshToken(refreshToken: string): { tokenId: string; tokenSecret: string } {
    const parts = refreshToken.split('.');
    this.authValidator.ensureRefreshTokenFormat(parts);

    return {
      tokenId: parts[0],
      tokenSecret: parts[1],
    };
  }

  private async hashSecret(secret: string): Promise<string> {
    const saltRounds = this.configService.getOrThrow<number>('BCRYPT_SALT_ROUNDS');

    return bcrypt.hash(secret, saltRounds);
  }

  private getRefreshTokenExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow<string>('jwt.refreshExpiresIn');
    const milliseconds = this.parseDurationToMilliseconds(expiresIn);

    return new Date(Date.now() + milliseconds);
  }

  private parseDurationToMilliseconds(duration: string): number {
    const match = /^(\d+)([smhd])$/.exec(duration);

    if (!match) {
      throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format.');
    }

    const value = Number(match[1]);
    const unit = match[2];
    const units = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * units[unit as keyof typeof units];
  }
}
