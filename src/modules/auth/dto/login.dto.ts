import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Length(5, 255)
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @Length(8, 72)
  password: string;
}
