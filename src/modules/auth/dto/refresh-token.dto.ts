import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67.a1b2c3d4',
    description: 'Refresh token opaco emitido pelo backend.',
  })
  @IsString()
  @Length(40, 256)
  @Matches(/^[0-9a-fA-F-]{36}\.[0-9a-fA-F]+$/)
  refreshToken: string;
}
