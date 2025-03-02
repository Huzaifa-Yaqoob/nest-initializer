import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import schemaMiddleware from "./middleware/user-schema.middleware";
import { UserResponse } from "./interceptors/user-response.interceptor";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: schemaMiddleware,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserResponse, UserService],
  exports: [UserService],
})
export class UserModule {}
