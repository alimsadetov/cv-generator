import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import jwtConfig from './config/jwt.config';
import globalConfig from './config/global.config';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middlewares/log-incoming-request.middleware';
import mailerConfig from './config/mailer.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NotAuthStrategy } from './strategies/not-auth.strategy';
import { CronModule } from './modules/cron/cron.module';
import { CvGeneratorModule } from './modules/cv-generator/cv-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env',
      load: [jwtConfig, globalConfig, mailerConfig],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join('asfdsadf'),
      serveRoot: '/static',
    }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    CronModule,
    CvGeneratorModule,
  ],
  providers: [JwtStrategy, NotAuthStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
