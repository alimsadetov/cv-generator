import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { IsMatch } from '../validators/password-match.constraint';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    description: 'Имя пользователя',
    type: String,
    nullable: false,
    example: 'Тест',
  })
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    type: String,
    nullable: false,
    example: 'Тестов',
  })
  @IsString()
  @IsOptional()
  readonly lastName: string;
}
