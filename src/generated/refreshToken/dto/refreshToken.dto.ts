import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenGeneratedDto {
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
}
