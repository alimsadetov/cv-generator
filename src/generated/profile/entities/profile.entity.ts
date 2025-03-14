import { ApiProperty } from '@nestjs/swagger';

export class ProfileGeneratedEntity {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  firstName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  lastName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phone: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  tgUsername: string | null;
}
