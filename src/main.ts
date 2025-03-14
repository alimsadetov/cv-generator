import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerBootstrap } from './bootstrap/swagger.bootstrap';
import { PrismaClientExceptionFilter } from './filters/prisma.filter';
import { ConfigService } from '@nestjs/config';
import { PORT, PROXY } from './config/global.config';
import * as cookieParser from 'cookie-parser';
import { CustomLoggerService } from './logger/custom-logger.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);

  // CORS
  const origin: RegExp[] = configService
    .get<string>('CORS_ORIGIN_CONFIG')
    ?.split('\n')
    .map((item: string): RegExp => new RegExp(item));
  if (!origin) {
    logger.warn(`Failed to get the value "CORS_ORIGIN_CONFIG"`, 'Bootstrap');
  }
  app.enableCors({
    origin: origin ?? ['*'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });

  const proxy = configService.get(PROXY);
  app.setGlobalPrefix(proxy);

  swaggerBootstrap(app, proxy);

  // Pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Filters
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.use(cookieParser());

  // app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  const port = configService.get(PORT);
  await app.listen(port, () => {
    logger.log(`App has started on port ${port}`, 'Bootstrap');
  });
}

bootstrap();
