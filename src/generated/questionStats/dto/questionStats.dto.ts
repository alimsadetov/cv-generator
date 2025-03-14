import { ApiProperty } from '@nestjs/swagger';

export class QuestionStatsGeneratedDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  tries: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  success: number;
}
