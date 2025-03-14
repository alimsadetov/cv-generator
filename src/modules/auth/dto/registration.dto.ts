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

export class AuthRegistrationDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    type: String,
    nullable: false,
    example: 'mail@example.ru',
  })
  @IsEmail({}, { message: 'Электронная почта введена неправильно' })
  readonly email: string;

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

  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  @ApiProperty({ example: '123456', description: 'Password for account.' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, undefined, {
    message: `Пароль должен быть минимум ${6} символов.`,
  })
  readonly password: string;

  @IsNotEmpty({ message: 'Пожалуйста, подтвердите пароль.' })
  @ApiProperty({
    example: '123456',
    description: 'Must be the same as password.',
  })
  @IsMatch('password', { message: 'Пароли не совпадают' })
  readonly passwordConfirm: string;
}
