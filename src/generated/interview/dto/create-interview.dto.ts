import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateInterviewGeneratedDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  endedAt?: Date | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  questionIds: number[];
}
