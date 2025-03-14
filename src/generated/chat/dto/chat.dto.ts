import { ApiProperty } from '@nestjs/swagger';

export class ChatGeneratedDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
