import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import * as process from 'node:process';
import {
  AllMongooseExceptionFilter,
  DuplicateKeyExceptionFilter,
} from './filters';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const origin = [process.env.ORIGIN ?? 'http://localhost:3000'];
const allowedHeaders = ['Content-Type'];

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(fastifyCookie);

  app.enableCors({
    origin,
    methods,
    allowedHeaders,
    credentials: true,
  });

  app.useGlobalFilters(
    new AllMongooseExceptionFilter(),
    new DuplicateKeyExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formattedErrors = {};

        for (const error of errors) {
          const property = error.property;
          const constraints = error.constraints;

          if (constraints) {
            formattedErrors[property] = Object.values(constraints);
          }
        }

        return new BadRequestException({
          message: formattedErrors,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Nest Js failed :', err);
  process.exit(1);
});
