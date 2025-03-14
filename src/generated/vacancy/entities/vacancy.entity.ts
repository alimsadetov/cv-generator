import { Lang } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { VacancyStatsGeneratedEntity } from '../../vacancyStats/entities/vacancyStats.entity';

export class VacancyGeneratedEntity {
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
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  questionsCount: number;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  technologies: string[];
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    isArray: true,
  })
  technologiesQuestionsCount: number[];
  @ApiProperty({
    type: 'boolean',
  })
  isActive: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  preview: string | null;
  @ApiProperty({
    type: () => VacancyStatsGeneratedEntity,
    required: false,
    nullable: true,
  })
  stats?: VacancyStatsGeneratedEntity | null;
}
