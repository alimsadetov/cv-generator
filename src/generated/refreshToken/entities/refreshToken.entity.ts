import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenGeneratedEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userAgent: string;
  @ApiProperty({
    type: 'string',
  })
  ipAddress: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  userId: number;
}
