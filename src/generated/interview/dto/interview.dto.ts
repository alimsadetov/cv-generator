import { InterviewStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class InterviewGeneratedDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  endedAt: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'boolean',
  })
  isFinished: boolean;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  maxPoints: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  pointsEarned: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  score: number;
  @ApiProperty({
    enum: InterviewStatus,
  })
  status: InterviewStatus;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    isArray: true,
  })
  questionIds: number[];
}
