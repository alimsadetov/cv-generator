import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
// import { REFRESH_SECRET } from '../config/global.config';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwtFromCookies,
      ]),
      ignoreExpiration: false,
      // secretOrKey: configService.get(REFRESH_SECRET) || 'REFRESH_SECRET',
      secretOrKey: 'REFRESH_SECRET',
    });
  }

  private static extractJwtFromCookies(req: Request): string | null {
    if (req.cookies && req.cookies.refresh_token) {
      return req.cookies.refresh_token;
    } else {
      try {
        const token: string = <string>req.headers.refresh;
        return token;
      } catch {}
    }

    return null;
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
