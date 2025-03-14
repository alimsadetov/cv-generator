import { ApiProperty } from '@nestjs/swagger';

export class UserInterviewLimitsGeneratedDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  limit: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  remain: number;
}
