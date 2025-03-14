import { ApiProperty } from '@nestjs/swagger';

export class QuestionStatsGeneratedEntity {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  questionId: number;
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
