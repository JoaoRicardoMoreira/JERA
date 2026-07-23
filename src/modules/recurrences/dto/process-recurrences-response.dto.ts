import { ApiProperty } from '@nestjs/swagger';

export class ProcessRecurrencesResponseDto {
  @ApiProperty({ example: 7 })
  month: number;

  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({ example: 3 })
  processedCount: number;

  @ApiProperty({ example: 1 })
  skippedCount: number;

  @ApiProperty({
    example: ['7f923c74-4c4b-4798-a5cf-d4098d561d70'],
    type: [String],
  })
  createdTransactionIds: string[];
}
