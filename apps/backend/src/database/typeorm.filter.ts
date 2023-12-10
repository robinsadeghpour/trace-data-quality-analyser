import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResponseError } from '@tdqa/types';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  public catch(exception: TypeORMError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = [this.generateMessage(exception)];

    try {
      switch (exception.constructor) {
        case QueryFailedError:
          throw new ConflictException(message);
        case EntityNotFoundError:
          throw new NotFoundException(message);
        default:
          throw new InternalServerErrorException([exception.name, message]);
      }
    } catch (error) {
      const body = this.generateBody(error);
      response.status(body.statusCode).send(body);
    }
  }

  private generateBody(exception: HttpException): ResponseError {
    return exception.getResponse() as ResponseError;
  }

  private generateMessage(exception: TypeORMError): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (exception as any).detail || exception.message;
  }
}
