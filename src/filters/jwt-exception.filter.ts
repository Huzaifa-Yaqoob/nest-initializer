import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";

@Catch(JsonWebTokenError, TokenExpiredError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = {
      statusCode: 401,
      message: "Unauthorized",
    };

    const error = (exception.getResponse() as any).message;

    if (error === "jwt expired") {
      errorResponse.message = "Your session has expired. Please log in again.";
    } else if (error === "invalid token" || error === "jwt malformed") {
      errorResponse.message =
        "Invalid authentication token. Please log in again.";
    } else if (error === "jwt not active") {
      errorResponse.message = "Your token is not active yet.";
    }

    response.status(401).json(errorResponse);
  }
}
