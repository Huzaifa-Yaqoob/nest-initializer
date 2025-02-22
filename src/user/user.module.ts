import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import schemaMiddleware from "./middleware/user-schema.middleware";
import configuration from "src/config/general.config";
import { UserResponse } from "../auth/interceptors/user-response.interceptor";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: schemaMiddleware,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: configuration.jwt.secret,
      signOptions: { expiresIn: "3s" },
    }),
  ],
  controllers: [UserController],
  providers: [UserResponse, UserService],
  exports: [UserService],
})
export class UserModule {}
