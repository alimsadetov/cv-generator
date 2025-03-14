import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  INVALID_REFRESH_TOKEN_CREDENTIALS,
  INVALID_REFRESH_TOKEN_ERROR,
  USER_NOT_EXIST,
  WRONG_PASSWORD_ERROR,
} from '../../exceptions/exceptions.consts';
import { AuthLoginEntity } from '../../entity/login-response.entity';
import { Auth } from '@/guards/auth.decorator';
import { AuthRegistrationEntity } from '../../entity/registration-response.entity';

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Logout user (deletes refresh token) - nothing more',
    }),
    ApiResponse({ status: 200 }),
    ApiResponse({ status: 422, description: INVALID_REFRESH_TOKEN_ERROR }),
    ApiResponse({
      status: 401,
      description: INVALID_REFRESH_TOKEN_CREDENTIALS,
    }),
  );
}

export function ApiSignUp() {
  return applyDecorators(
    ApiOperation({ summary: 'Registration of the new user' }),
    ApiResponse({ status: 200 }),
    // ApiResponse({ status: 200, type: LoginResponceDto }),
    // ApiResponse({
    // 	status: 400,
    // 	description: `${PASSWORDS_MUST_MATCH_ERROR} | ${USER_WITH_EMAIL_ALREADY_EXISTS_ERROR}`,
    // })
  );
}

export function ApiSignIn() {
  return applyDecorators(
    ApiOperation({ summary: 'User authentication' }),
    ApiResponse({ status: 200, type: AuthLoginEntity }),
    //ApiResponse({ status: 200, type: LoginResponceDto }),
    // ApiResponse({
    //   status: 404,
    //   description: USER_WITH_EMAIL_NOT_FOUND_ERROR,
    // }),
    ApiResponse({
      status: 401,
      description: WRONG_PASSWORD_ERROR,
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'User update' }),
    ApiResponse({ status: 200, type: AuthRegistrationEntity }),
    //ApiResponse({ status: 200, type: LoginResponceDto }),
    // ApiResponse({
    //   status: 404,
    //   description: USER_WITH_EMAIL_NOT_FOUND_ERROR,
    // }),
    // ApiResponse({
    //   status: 401,
    //   description: WRONG_PASSWORD_ERROR,
    // }),
  );
}

export function ApiGetUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user info' }),
    ApiResponse({ status: 200, type: AuthLoginEntity }),
    ApiResponse({
      status: 404,
      description: USER_NOT_EXIST,
    }),
    Auth(),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh user access token' }),
    //   ApiResponse({ status: 200, type: LoginResponceDto }),
    ApiResponse({ status: 422, description: INVALID_REFRESH_TOKEN_ERROR }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Смена пароля' }),
    ApiResponse({ status: 200 }),
    ApiResponse({ status: 422, description: INVALID_REFRESH_TOKEN_ERROR }),
    ApiResponse({
      status: 401,
      description: INVALID_REFRESH_TOKEN_CREDENTIALS,
    }),
  );
}

export function ApiChangeRole() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Поменять роль пользователю',
      description: 'нужно быть админом',
    }),
    ApiResponse({ status: 200 }),
  );
}
