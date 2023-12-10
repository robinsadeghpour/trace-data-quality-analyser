import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  public use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const start = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - start;

      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
