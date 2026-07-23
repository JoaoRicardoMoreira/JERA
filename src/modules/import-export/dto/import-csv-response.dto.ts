import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImportCsvResponseDto {
  @ApiProperty({ example: 12 })
  @Expose()
  importedCount: number;
}
