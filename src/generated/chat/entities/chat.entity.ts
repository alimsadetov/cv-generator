import { ApiProperty } from '@nestjs/swagger';

export class ChatGeneratedEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
