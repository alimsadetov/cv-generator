import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserGeneratedDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;
  @ApiProperty({
    maximum: 50,
    type: 'string',
    nullable: true,
  })
  chatId: string | null;
  @ApiProperty({
    maximum: 255,
    type: 'string',
    nullable: true,
  })
  username: string | null;
  @ApiProperty({
    maximum: 255,
    type: 'string',
    nullable: true,
  })
  email: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  passwordHash: string | null;
  @ApiProperty({
    enum: Role,
  })
  role: Role;
  @ApiProperty({
    maximum: 50,
    type: 'string',
  })
  ip: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  token: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
