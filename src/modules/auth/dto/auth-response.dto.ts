import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';

export class AuthUserResponseDto {
  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Finance User' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.USER] })
  @Expose()
  roles: Role[];

  @ApiProperty({ type: [String], example: ['dashboard:read'] })
  @Expose()
  permissions: string[];
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  @Expose()
  user: AuthUserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token.',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67.a1b2c3d4',
    description: 'Refresh token opaco. Nao e persistido em texto puro.',
  })
  @Expose()
  refreshToken: string;
}
