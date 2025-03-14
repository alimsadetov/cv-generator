import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ACCESS_SECRET } from '../config/global.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(ACCESS_SECRET) || 'ACCESS_SECRET',
      });
      if (!payload.id) {
        throw new UnauthorizedException();
      }
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token: string = request.cookies.access_token;
    if (!token) {
      try {
        return request.headers.authorization.split(' ')[1];
      } catch {}
    }
    return token;
  }
}
