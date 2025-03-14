import { ApiProperty } from '@nestjs/swagger';
import { AuthLoginEntity } from './login-response.entity';

export class UserEntityWithPasswordHash extends AuthLoginEntity {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  passwordHash: string | null;
}
