import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { AuthLoginDto } from './dto/login.dto';
import { AuthLoginEntity } from './entity/login-response.entity';
import { AuthUserEnvMetaDto } from './dto/user-env-meta.dto';
import { JwtConfigService } from './services/jwtConfig.service';
import { IncomingHttpHeaders } from 'http';
import {
  ApiSignIn,
  ApiLogout,
  ApiRefresh,
  ApiGetUser,
  ApiUpdateUser,
} from './decorators/swagger/auth-api.decorators';
import { UserService } from './services/user.service';
import { JwtMyService } from './services/jwtMy.service';
import { AuthRegistrationDto } from './dto/registration.dto';
import { AuthRegistrationEntity } from './entity/registration-response.entity';
import { AuthTokensDto } from './dto/tokens.dto';
import { GetJwtPayload } from '@/decorators/get-jwtpayload.decorator';
import { JwtPayload } from '@/types/jwt-payload.type';
import { Auth } from '@/guards/auth.decorator';
import { UpdateUserRequestDto } from './dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtMySerivce: JwtMyService,
  ) {}

  @ApiSignIn()
  @HttpCode(200)
  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Req() { headers }: Request,
    @Ip() ip: string,
    @Body() { login, password }: AuthLoginDto,
    @Headers() { origin }: any,
  ): Promise<AuthLoginEntity> {
    // const news: any = {};
    // console.log(news.aasdf.qweuri);
    const user = await this.authService.signIn(
      login,
      password,
      headers,
      ip,
      origin,
      res,
    );
    return user;
  }

  @ApiGetUser()
  @HttpCode(200)
  @Get('')
  async get(@GetJwtPayload() payload: JwtPayload): Promise<AuthLoginEntity> {
    const user = await this.authService.getUser(payload);
    return user;
  }

  @ApiSignIn()
  @HttpCode(200)
  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Req() { headers }: Request,
    @Ip() ip: string,
    @Body() dto: AuthRegistrationDto,
    @Headers() { origin }: any,
  ): Promise<AuthRegistrationEntity> {
    const user = await this.authService.signUp(dto, headers, ip, origin, res);
    return user;
  }

  @Auth()
  @ApiUpdateUser()
  @Put('')
  async updateUser(
    @Body() dto: UpdateUserRequestDto,
    @GetJwtPayload() user: JwtPayload,
  ): Promise<AuthRegistrationEntity> {
    const usr = await this.authService.updateUser(user.id, dto);
    return usr;
  }

  @ApiRefresh()
  @HttpCode(200)
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Req() { headers }: Request,
    @Headers() { origin }: any,
  ): Promise<AuthTokensDto> {
    const tokens = await this.authService.refresh(
      this.jwtMySerivce.getRefreshTokenFromCookies(req),
      this.authService.getUserEnvMeta(headers, ip),
    );
    this.jwtMySerivce.setTokenCookies(res, tokens, origin);
    return { accessToken: tokens.accessToken };
  }

  @ApiLogout()
  @HttpCode(200)
  // @Auth()
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Headers() { origin }: any,
  ): Promise<void> {
    //this.resetCookiesRefreshToken(res);
    return await this.authService.logout(req, res, origin);
  }

  // @ApiChangePassword()
  // @HttpCode(200)
  // @Auth()
  // @Put('change-password')
  // async changePassword(
  //   @Body() dto: ChangePasswordDto,
  //   @Req() req: Request,
  // ): Promise<void> {
  //   if (dto.password != dto.passwordConfirm) {
  //     throw new BadRequestException('Пароли не совпадают');
  //   }
  //   const refreshStr = this.getRefreshTokenFromCookies(req);
  //   return this.authService.changePassword({
  //     refreshStr,
  //     password: dto.password,
  //     newPassword: dto.newPassword,
  //   });
  // }

  // @ApiChangeRole()
  // @Auth(Role.Superadmin)
  // @Put('change-role/:id')
  // async changeRole(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: ChangeRoleDto,
  // ): Promise<void> {
  //   await this.userService.update({ where: { id }, data: dto });
  // }
}
