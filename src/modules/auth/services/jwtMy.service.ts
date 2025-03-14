import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, RefreshToken, Role, User } from '@prisma/client';
import { PrismaService } from '../../database/services/prisma.service';
import { JwtConfigService } from './jwtConfig.service';
import { sign, verify } from 'jsonwebtoken';
import { AuthTokensDto } from '../dto/tokens.dto';
import { AuthUserEnvMetaDto } from '../dto/user-env-meta.dto';
import {
  INVALID_REFRESH_TOKEN_CREDENTIALS,
  INVALID_REFRESH_TOKEN_ERROR,
} from '../exceptions/exceptions.consts';
import { Request, Response } from 'express';
import { JwtPayload } from '@/types/jwt-payload.type';

@Injectable()
export class JwtMyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  private readonly refreshTokenRepository = this.prisma.refreshToken;

  async createTokens(
    data: Prisma.RefreshTokenCreateInput,
  ): Promise<AuthTokensDto> {
    const refreshObject = await this.refreshTokenRepository.create({
      data,
      include: { user: true },
    });
    console.log(refreshObject);
    // const refreshObject = {
    //   id: 'ifower',
    //   userAgent: 'mozilla',
    //   ipAddress: '127.0.0.1',
    //   userId: 2,
    //   user,
    // };
    return {
      refreshToken: this.signNewRefreshToken(refreshObject),
      accessToken: this.signNewAccessToken(refreshObject.user),
    };
  }

  public decodeRefresh(refreshStr: string): any {
    try {
      const decoded = verify(refreshStr, this.jwtConfigService.refreshSecret);
      if (typeof decoded === 'string') {
        throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN_ERROR);
      }
      return decoded;
    } catch (e) {
      throw new UnprocessableEntityException(INVALID_REFRESH_TOKEN_ERROR);
    }
  }

  public async retrieveRefreshToken(refreshStr: string): Promise<RefreshToken> {
    const decoded = this.decodeRefresh(refreshStr);
    const id: string = decoded?.id;
    console.log(id);
    const refreshToken: RefreshToken = await this.findRefreshTokenById(id);
    if (!refreshToken) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_CREDENTIALS);
    }

    return refreshToken;
  }

  async refreshTokens(
    userId: User['id'],
    userEnvMeta: AuthUserEnvMetaDto,
    oldRefreshTokenId: string,
  ): Promise<AuthTokensDto> {
    const newTokens = await this.createTokens({
      ...userEnvMeta,
      user: { connect: { id: userId } },
    });

    await this.refreshTokenRepository.delete({
      where: { id: oldRefreshTokenId },
    });

    return newTokens;
  }

  private signNewRefreshToken(refreshToken: RefreshToken) {
    return sign(
      { ...refreshToken, userId: refreshToken.userId },
      this.jwtConfigService.refreshSecret,
    );
  }

  private signNewAccessToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      // email: user.email,
      // username: user.username,
      role: user.role,
      isLogined: true,
      ip: user.ip,
    };
    return sign(payload, this.jwtConfigService.accessSecret, {
      expiresIn: this.jwtConfigService.accessTokenDuration,
    });
  }

  async deleteRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.delete({
      where: { id: id },
    });
  }

  private async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findUnique({
      where: { id },
    });
  }

  getRefreshTokenFromCookies(req: Request): string {
    const cookieName = this.getRefreshTokenCookieName();
    return req.cookies[cookieName];
  }

  setCookiesRefreshToken(
    res: Response,
    refreshToken: string,
    origin?: string,
  ): void {
    const domain = origin?.includes('localhost')
      ? '.localhost'
      : this.jwtConfigService.cookieDomain;
    const httpOnly = !origin?.includes('localhost');
    const secure = origin?.includes('https') ? true : false;
    const sameSite =
      origin?.includes('localhost') || !secure ? undefined : 'none';
    res.cookie(this.getRefreshTokenCookieName(), refreshToken, {
      domain,
      secure,
      sameSite,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly,
    });
  }

  //private resetCookiesRefreshToken(res: Response): void {
  //  const tokenName = this.getRefreshTokenCookieName();
  //  res.cookie(tokenName, '', { httpOnly: false });
  //}

  private getRefreshTokenCookieName(): string {
    return this.jwtConfigService.refresjTokenCookieName;
  }

  setTokenCookies(res: Response, tokens: AuthTokensDto, origin?: string): void {
    const domain = origin?.includes('localhost')
      ? '.localhost'
      : this.jwtConfigService.cookieDomain;
    const secure = origin?.includes('https') ? true : false;
    const sameSite =
      origin?.includes('localhost') || !secure ? undefined : 'none';
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: !origin?.includes('localhost'),
      domain,
      secure,
      sameSite,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: !origin?.includes('localhost'),
      domain,
      secure,
      sameSite,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }

  clearTokenCookies(res: Response, origin?: string): void {
    const domain = origin?.includes('localhost')
      ? '.localhost'
      : this.jwtConfigService.cookieDomain;
    const secure = origin?.includes('https') ? true : false;
    const sameSite =
      origin?.includes('localhost') || !secure ? undefined : 'none';
    res.clearCookie('access_token', {
      httpOnly: !origin?.includes('localhost'),
      domain,
      secure,
      sameSite,
    });
    res.clearCookie('refresh_token', {
      httpOnly: !origin?.includes('localhost'),
      domain,
      secure,
      sameSite,
    });
  }
}
