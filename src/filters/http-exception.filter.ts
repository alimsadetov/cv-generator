import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

const logger = new CustomLoggerService();

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res: any = { ...exception };

    logger.warn(res.response?.message ?? res.message, 'Exception');

    response.status(status).json(res.response);
  }
}
