import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ACCESS_SECRET } from '../config/global.config';
import { ExtendedRequest } from '@/types/extended-req.type';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class OptionalJwtAuthGuard
  extends AuthGuard(['jwt', 'not-auth'])
  implements CanActivate
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    console.log('headers', request.headers);
    console.log('ip', request.ip);
    console.log('ips', request.ips);
    console.log('cookies', request.cookies);
    const ip = this.getRequestIp(request.headers, request.ip);
    console.log('chosen ip', ip);
    console.log('token', token);
    if (!token) {
      request.user = {
        ip,
        isLogined: false,
      };
      return true;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(ACCESS_SECRET) || 'ACCESS_SECRET',
      });
      request.user = payload;
    } catch (e) {
      console.log(e);
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

  private getRequestIp(headers: IncomingHttpHeaders, ip: string): string {
    // Сначала проверяем заголовок x-ip
    if (headers['x-ip']) {
      return Array.isArray(headers['x-ip'])
        ? headers['x-ip'][0]
        : headers['x-ip'];
    }

    // Если x-ip пустой, проверяем x-real-ip
    return (
      (Array.isArray(headers['x-real-ip'])
        ? headers['x-real-ip'][0]
        : headers['x-real-ip']) ?? ip
    );
  }
}
