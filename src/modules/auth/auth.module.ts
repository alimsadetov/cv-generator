import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtMyService } from './services/jwtMy.service';
import { SecureService } from './services/secure.service';
import { JwtConfigService } from './services/jwtConfig.service';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_SECRET } from '../../config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: configService.get(ACCESS_SECRET) || 'ACCESS_SECRET',
        signOptions: { expiresIn: '24h' }, //configService.get(JWT_EXPIRES_IN) },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtMyService,
    SecureService,
    JwtConfigService,
    JwtService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
