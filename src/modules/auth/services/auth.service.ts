import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, RefreshToken, Role, User } from '@prisma/client';
import { compare } from 'bcrypt';
import { AuthRegistrationDto } from '../dto/registration.dto';
import { SecureService } from './secure.service';
import { JwtMyService } from './jwtMy.service';
import { AuthUserEnvMetaDto } from '../dto/user-env-meta.dto';
import { AuthTokensDto } from '../dto/tokens.dto';
import {
  USER_NOT_EXIST,
  WRONG_PASSWORD_ERROR,
} from '../exceptions/exceptions.consts';
import { IncomingHttpHeaders } from 'http';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { JwtPayload } from '@/types/jwt-payload.type';
import { AuthRegistrationEntity } from '../entity/registration-response.entity';
import { AuthLoginEntity } from '../entity/login-response.entity';
import { UpdateUserRequestDto } from '../dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly jwtService: JwtMyService,
  ) {}

  // todo добавить сохранение userAgent
  async signIn(
    emailOrUsername: string,
    password: string,
    headers: IncomingHttpHeaders,
    ip: string,
    origin: string,
    res: Response,
  ): Promise<AuthRegistrationEntity> {
    const userEnvMeta: AuthUserEnvMetaDto = this.getUserEnvMeta(headers, ip);
    const user =
      await this.userService.getUserByEmailOrUsername(emailOrUsername);
    // const user = {
    //   id: 2,
    //   username: emailOrUsername,
    //   chatId: '',
    //   email: emailOrUsername,
    //   role: Role.User,
    //   phone: '123456',
    //   passwordHash: 'fwieurfwerfui',
    //   createdAt: new Date(),
    //   ip: '0.0.0.0',
    // };
    if (!user) {
      throw new UnauthorizedException(USER_NOT_EXIST);
    }
    await this.validatePassword(user.passwordHash, password);
    const newTokens = await this.jwtService.createTokens({
      ...userEnvMeta,
      user: { connect: { id: user.id } },
    });
    this.jwtService.setTokenCookies(res, newTokens, origin);
    const { passwordHash, ...data } = user;

    return data;
  }

  async getUser(payload: JwtPayload): Promise<AuthLoginEntity> {
    const user = await this.userService.getUserOrThrow({ id: payload.id });
    return user;
  }

  async getOrSignUpUserByIp(ip: string): Promise<{ id: number }> {
    const foundUser = await this.userService.getUserByIp(ip);
    if (foundUser) {
      return foundUser;
    }
    return await this.userService.createUserByIp(ip);
  }

  async getUserIdByJwtPayload(
    payload: JwtPayload,
    res: Response,
    headers: IncomingHttpHeaders,
    origin: string,
  ): Promise<number> {
    if (!payload.isLogined) {
      const user = await this.getOrSignUpUserByIp(payload.ip);
      const userEnvMeta: AuthUserEnvMetaDto = this.getUserEnvMeta(
        headers,
        payload.ip,
      );
      const newTokens = await this.jwtService.createTokens({
        ...userEnvMeta,
        user: { connect: { id: user.id } },
      });
      this.jwtService.setTokenCookies(res, newTokens, origin);
      return user.id;
    } else {
      return payload.id;
    }
  }

  async signUp(
    registrationDto: AuthRegistrationDto,
    headers: IncomingHttpHeaders,
    ip: string,
    origin: string,
    res: Response,
  ): Promise<AuthRegistrationEntity> {
    const userEnvMeta: AuthUserEnvMetaDto = this.getUserEnvMeta(headers, ip);
    const foundUserWithSameIp = await this.userService.getNotRegisteredUserByIp(
      userEnvMeta.ipAddress,
    );
    if (foundUserWithSameIp) {
      const updated = await this.userService.registerCreatedByIpUser(
        foundUserWithSameIp.id,
        {
          username: registrationDto.email,
          email: registrationDto.email,
          passwordHash: await this.secureService.hashString(
            registrationDto.password,
          ),
          ip: userEnvMeta.ipAddress,
          profile: {
            create: {
              firstName: registrationDto.firstName,
              lastName: registrationDto.lastName,
            },
          },
        },
      );
      const newTokens = await this.jwtService.createTokens({
        ...userEnvMeta,
        user: { connect: { id: updated.id } },
      });
      this.jwtService.setTokenCookies(res, newTokens, origin);
      return updated;
    } else {
      const created = await this.userService.createUser({
        username: registrationDto.email,
        email: registrationDto.email,
        passwordHash: await this.secureService.hashString(
          registrationDto.password,
        ),
        ip: userEnvMeta.ipAddress,
        profile: {
          create: {
            firstName: registrationDto.firstName,
            lastName: registrationDto.lastName,
          },
        },
      });

      const newTokens = await this.jwtService.createTokens({
        ...userEnvMeta,
        user: { connect: { id: created.id } },
      });
      this.jwtService.setTokenCookies(res, newTokens, origin);
      return created;
    }
  }

  async updateUser(
    userId: number,
    dto: UpdateUserRequestDto,
  ): Promise<AuthRegistrationEntity> {
    const user = await this.userService.getUserOrThrow({ id: userId });
    if (!user) {
      throw new UnauthorizedException(USER_NOT_EXIST);
    }
    const created = await this.userService.updateUser(dto, userId);
    return created;
  }

  async logout(req: Request, res: Response, origin?: string): Promise<void> {
    const refreshStr = this.jwtService.getRefreshTokenFromCookies(req);
    const refreshToken: RefreshToken =
      await this.jwtService.retrieveRefreshToken(refreshStr);
    await this.jwtService.deleteRefreshTokenById(refreshToken.id);
    await this.jwtService.clearTokenCookies(res, origin);
  }

  async refresh(
    refreshStr: string,
    userEnvMeta: AuthUserEnvMetaDto,
  ): Promise<AuthTokensDto> {
    console.log(refreshStr, 'REFRESH STR');
    const refreshToken: RefreshToken =
      await this.jwtService.retrieveRefreshToken(refreshStr);
    const user = await this.userService.getUserOrThrow({
      id: refreshToken.userId,
    });

    return this.jwtService.refreshTokens(user.id, userEnvMeta, refreshToken.id);
  }

  private async validatePassword(passwordHash: string, password: string) {
    if (!(await compare(password, passwordHash))) {
      // todo создать более перфинифицированное исключение
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
  }

  // async changePassword(params: {
  //   refreshStr: string;
  //   password: string;
  //   newPassword: string;
  // }): Promise<void> {
  //   const { refreshStr, password, newPassword } = params;
  //   const decoded = this.jwtService.decodeRefresh(refreshStr);
  //   const user = await this.userService.getUserOrThrow({ id: decoded?.userId });
  //   this.validatePassword(user, password);
  //   const passwordHash = await this.secureService.hashString(newPassword);
  //   await this.userService.update({
  //     where: { id: decoded?.userId },
  //     data: { passwordHash },
  //   });
  // }

  getUserEnvMeta(headers: IncomingHttpHeaders, ip: string): AuthUserEnvMetaDto {
    console.log('HEADERS', headers);

    return {
      ipAddress: this.getRequestIp(headers, ip),
      userAgent: headers['user-agent'],
    };
  }

  // Вставьте предыдущий метод getRequestIp здесь
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
