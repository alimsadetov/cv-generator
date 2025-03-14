import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { ROLES_KEY } from './roles.decorator';
import { RolesGuard } from './roles.guards';
import { OptionalJwtAuthGuard } from './optional-jwt-guard';

export function OptionalAuth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(OptionalJwtAuthGuard),
    ApiCookieAuth('access_token'),
  );
}
