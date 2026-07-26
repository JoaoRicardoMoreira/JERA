import { Gender } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'Joao Ricardo' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @Matches(/\S/, { message: 'name must contain non-whitespace characters' })
  name?: string;

  @ApiPropertyOptional({ example: '1995-08-17', nullable: true })
  @IsOptional()
  @IsDateString({ strict: true })
  birthDate?: string | null;

  @ApiPropertyOptional({ enum: Gender, nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender | null;

  @ApiPropertyOptional({ example: '+55 11 99999-9999', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Desenvolvedor de software', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  occupation?: string | null;

  @ApiPropertyOptional({ example: 'Sao Paulo', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @ApiPropertyOptional({ example: 'SP', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  state?: string | null;

  @ApiPropertyOptional({
    example: 'Construindo uma vida financeira mais previsivel.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;
}
