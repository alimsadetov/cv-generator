import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed on the ${exception.meta.modelName} model`,
          exception,
        });
        break;
      }
      case 'P2003': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: `Foreign key constraint failed on the field ${exception.meta.field_name}`,
          exception,
        });
        break;
      }
      case 'P2023': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: `Inconsistent column data: ${exception.meta.message}`,
          exception,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        const cause = exception?.meta?.cause;
        const modelName = exception?.meta?.modelName;
        const message =
          cause && modelName ? `${modelName} - ${cause}` : exception?.name;
        response.status(status).json({
          statusCode: status,
          message,
          exception,
        });
        break;
      }
      default:
        console.error(`Excpetion Code: ${exception.code}\n`, exception);
        super.catch(exception, host);
        break;
    }
  }
}
