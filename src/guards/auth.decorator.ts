import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { ROLES_KEY } from './roles.decorator';
import { RolesGuard } from './roles.guards';
import { WsAuthGuard } from './ws-auth.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard),
    UseGuards(RolesGuard),
    ApiCookieAuth('access_token'),
  );
}

export function WsAuth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(WsAuthGuard),
    ApiCookieAuth('access_token'),
  );
}
