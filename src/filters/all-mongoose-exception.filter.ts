import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import mongoose from 'mongoose';

@Catch(mongoose.Error)
export class AllMongooseExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    if (exception instanceof mongoose.Error.ValidationError) {
      const formattedErrors: Record<string, string[]> = {};
      for (const field in exception.errors) {
        if (Object.prototype.hasOwnProperty.call(exception.errors, field)) {
          formattedErrors[field] = [exception.errors[field].message];
        }
      }

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
