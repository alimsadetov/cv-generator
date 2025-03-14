import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class AuthChangeRoleDto {
  @ApiProperty({
    description: 'Роль пользователя',
    enum: $Enums.Role,
    example: $Enums.Role.Superadmin,
  })
  @IsEnum($Enums.Role)
  readonly role: $Enums.Role;
}
