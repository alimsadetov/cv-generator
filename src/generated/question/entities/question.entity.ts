import { Lang } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionStatsGeneratedEntity } from '../../questionStats/entities/questionStats.entity';

export class QuestionGeneratedEntity {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;
  @ApiProperty({
    maximum: 255,
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
  })
  answer: string;
  @ApiProperty({
    enum: Lang,
  })
  lang: Lang;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  level: number;
  @ApiProperty({
    type: 'string',
  })
  mainTechnology: string;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  technologies: string[];
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  importance: number;
  @ApiProperty({
    type: 'string',
  })
  criteria: string;
  @ApiProperty({
    type: () => QuestionStatsGeneratedEntity,
    required: false,
    nullable: true,
  })
  stats?: QuestionStatsGeneratedEntity | null;
}
