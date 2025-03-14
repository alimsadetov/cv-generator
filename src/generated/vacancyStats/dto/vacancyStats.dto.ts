import { ApiProperty } from '@nestjs/swagger';

export class VacancyStatsGeneratedDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  successTries: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  totalTries: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  failedTries: number;
}
