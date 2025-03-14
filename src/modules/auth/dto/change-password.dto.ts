import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsMatch } from '../validators/password-match.constraint';

export class AuthChangePasswordDto {
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

  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  @ApiProperty({ example: '123456', description: 'Password for account.' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @Length(6, undefined, {
    message: `Пароль должен быть минимум ${6} символов.`,
  })
  readonly newPassword: string;
}
