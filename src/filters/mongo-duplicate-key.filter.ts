import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { FastifyReply } from 'fastify';

@Catch(MongoServerError)
export class DuplicateKeyExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    if (exception.code === 11000) {
      const formattedErrors = {};
      const key = Object.keys(exception?.keyValue ?? {})[0];
      formattedErrors[key] = [`${key} already exists.`];

      return response.status(400).send({
        statusCode: 400,
        message: formattedErrors,
      });
    }

    return response.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
