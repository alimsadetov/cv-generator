import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionMessage } from '../interfaces/http-exception-message.interface';

export class ValidationException extends HttpException {
  messages: HttpExceptionMessage[] | undefined;

  constructor(
    response: string | HttpExceptionMessage[],
    key?: string | string[],
  ) {
    if (typeof response == 'string') {
      super(
        {
          statusCode: 400,
          field: key ? key : 'none',
          message: response,
          error: 'Validation',
        },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }
    const messages: HttpExceptionMessage[] = response.map((message) => {
      return {
        statusCode: 400,
        field: message?.field ? message.field : 'none',
        message: message.message,
        error: 'Validation',
      };
    });

    super(messages, HttpStatus.BAD_REQUEST);

    this.messages = response;
  }
}
