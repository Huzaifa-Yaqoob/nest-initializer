import { NestFactory } from "@nestjs/core";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { ErrorMessage } from "./helpers/ErrorMessage";
import configuration from "./config/general.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: formatError,
    })
  );

  app.use(cookieParser());

  await app.listen(configuration.port);
}
bootstrap();

// function to format the errors
function formatError(errors: any) {
  throw new BadRequestException(
    errors.map((error: any) => {
      const msg = Object.values(error.constraints)[0];
      return new ErrorMessage(
        error.property,
        typeof msg === "string" ? msg : "unknown"
      );
    })
  );
}
