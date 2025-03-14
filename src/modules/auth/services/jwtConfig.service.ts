import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_SECRET,
  ACCESS_TOKEN_DURATION,
  COOKIE_DOMAIN,
  REFRESH_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  SALT_ROUNDS,
} from '../../../config/jwt.config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get refreshSecret(): string {
    return this.configService.get<string>(REFRESH_SECRET);
  }

  get accessSecret(): string {
    return this.configService.get<string>(ACCESS_SECRET);
  }

  get accessTokenDuration(): string {
    return this.configService.get<string>(ACCESS_TOKEN_DURATION);
  }

  get saultRounds(): string {
    return this.configService.get<string>(SALT_ROUNDS);
  }

  get refresjTokenCookieName(): string {
    return this.configService.get<string>(REFRESH_TOKEN_COOKIE_NAME);
  }

  get cookieDomain(): string {
    return this.configService.get<string>(COOKIE_DOMAIN);
  }
}
