import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}
  private readonly reqDurationMark = 'request-start';

  use(request: Request, response: Response, next: NextFunction): void {
    performance.mark(this.reqDurationMark);
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent');

    response.on('finish', () => {
      const reqDurationInSeconds = Number(
        (performance.measure('', this.reqDurationMark).duration / 1000).toFixed(
          3,
        ),
      );
      const { statusCode } = response;
      this.logger.log('req finished', {
        context: 'api',
        reqDurationInSeconds,
        method,
        originalUrl,
        statusCode,
        userAgent,
        ip,
      });
    });
    next();
  }
}
