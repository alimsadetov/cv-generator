import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserGeneratedDto {
  @ApiProperty({
    maximum: 50,
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  chatId?: string | null;
  @ApiProperty({
    maximum: 255,
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  username?: string | null;
  @ApiProperty({
    maximum: 255,
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  passwordHash?: string | null;
  @ApiProperty({
    maximum: 50,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  ip: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  token?: string | null;
}
