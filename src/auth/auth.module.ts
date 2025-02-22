import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import configuration from "src/config/general.config";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: configuration.jwt.secret,
      signOptions: { expiresIn: "3s" },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
