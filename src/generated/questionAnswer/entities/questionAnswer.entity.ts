import { ApiProperty } from '@nestjs/swagger';

export class QuestionAnswerGeneratedEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  answer: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  scoreGained: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  maxScore: number;
  @ApiProperty({
    type: 'boolean',
  })
  isMaxScoreGained: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'boolean',
  })
  isResponseFromGptReceived: boolean;
}
