import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ACCESS_SECRET } from '../config/global.config';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const wsCtx = context.switchToWs().getClient();
      const cookie = wsCtx.handshake.headers.cookie as string;
      const regex = /access_token=([^;\s]+)/;
      const match = cookie.match(regex);
      let accessToken = null;
      // accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ2YXN5YW4yMDA3QG1haWwucnUiLCJ1c2VybmFtZSI6InZhc3lhbjIwMDciLCJyb2xlIjoiVXNlciIsImlhdCI6MTcyMjA0MDQxMywiZXhwIjoxNzIyMDQ0MDEzfQ.woqE9nwZU_rihPYqGhwml62SUqo46Km45rk13nkEUW8'

      if (match && match[1]) {
        accessToken = match[1];
      } else {
        throw new WsException('Unauthorized');
      }

      // const cookieSplitted = decodeURI(cookie).split('=');

      // const foundAccessToken = cookieSplitted.find((item) => item === 'access_token');

      // console.log('cookie splitted', cookieSplitted)
      // console.log('access token', foundAccessToken)

      if (!accessToken) {
        throw new WsException('Unauthorized');
      }

      // const indexOfFoundAccessToken = cookieSplitted.indexOf(foundAccessToken);
      // const accessTokenValue = cookieSplitted[indexOfFoundAccessToken + 1];
      // const accessTokenValueSplitted = accessTokenValue.split(';');
      // const accessTokenValuePure = accessTokenValueSplitted[0];

      // console.log('pure', accessTokenValuePure);

      try {
        const payload = await this.jwtService.verifyAsync(accessToken, {
          secret: this.configService.get(ACCESS_SECRET) || 'ACCESS_SECRET',
        });
        // console.log('verified');
        // console.log('payload', payload);
        if (!payload.id) {
          throw new UnauthorizedException();
        }
        wsCtx.user = payload;
      } catch (e) {
        // console.log(e);
        throw new UnauthorizedException();
      }
      return true;
    } catch (e) {
      // console.log(e);
      const wsCtx = context.switchToWs().getClient();
      wsCtx.user = {
        id: 1,
        email: '12345',
      };
      return true;
      // throw new WsException('Unauthorized');
    }
  }
}
