import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Finance User', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiProperty({ example: 'user@example.com', maxLength: 255 })
  @IsEmail()
  @Length(5, 255)
  email: string;

  @ApiProperty({
    example: 'StrongPass123',
    minLength: 8,
    maxLength: 72,
    description: 'Senha com letras e numeros.',
  })
  @IsString()
  @Length(8, 72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password: string;
}
