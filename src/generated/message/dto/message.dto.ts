import { MessageStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MessageGeneratedDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  chatGptUuid: string | null;
  @ApiProperty({
    enum: MessageStatus,
  })
  status: MessageStatus;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
