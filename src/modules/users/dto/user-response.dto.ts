import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserResponseDto {
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

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2026-07-03T00:00:00.000Z' })
  @Expose()
  updatedAt: string;
}
