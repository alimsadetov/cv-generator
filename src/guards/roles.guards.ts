import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.getRequiredRoles(context);
    if (!requiredRoles.length) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    if (this.isUserHasRole(user, requiredRoles)) {
      return true;
    } else {
      throw new ForbiddenException('NO_ACCESS_ERROR');
    }
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
    return this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private isUserHasRole(user: any, requiredRoles: string[]): boolean {
    return requiredRoles.includes(user.role);
  }
}
