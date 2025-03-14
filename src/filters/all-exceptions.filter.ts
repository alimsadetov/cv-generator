import { CustomLoggerService } from '@/logger/custom-logger.service';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

//   const logger = new CustomLoggerService();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger: CustomLoggerService;
  constructor(_logger: CustomLoggerService) {
    this.logger = _logger;
  }
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception?.message ? exception.message : exception;

    this.logger.error(exception.stack);

    if (!message) {
      message = 'Internal Server Error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
