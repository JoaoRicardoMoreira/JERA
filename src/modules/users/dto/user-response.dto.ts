import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
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

  @ApiProperty({ example: '1995-08-17', nullable: true })
  @Expose()
  birthDate: string | null;

  @ApiProperty({ example: 30, nullable: true })
  @Expose()
  age: number | null;

  @ApiProperty({ enum: Gender, nullable: true })
  @Expose()
  gender: Gender | null;

  @ApiProperty({ example: '+55 11 99999-9999', nullable: true })
  @Expose()
  phone: string | null;

  @ApiProperty({ example: 'Desenvolvedor de software', nullable: true })
  @Expose()
  occupation: string | null;

  @ApiProperty({ example: 'Sao Paulo', nullable: true })
  @Expose()
  city: string | null;

  @ApiProperty({ example: 'SP', nullable: true })
  @Expose()
  state: string | null;

  @ApiProperty({ example: 'Construindo uma jornada mais previsivel.', nullable: true })
  @Expose()
  bio: string | null;

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
