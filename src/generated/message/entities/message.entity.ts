import { MessageStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MessageGeneratedEntity {
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
    type: 'string',
    nullable: true,
  })
  questionAnswerId: string | null;
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
