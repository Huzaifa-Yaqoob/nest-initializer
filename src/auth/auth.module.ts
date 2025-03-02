import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { LocalStrategy, JwtStrategy } from "./strategies";
import generalConfig from "src/config/general.config";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: generalConfig.jwt.secretAT,
      signOptions: { expiresIn: generalConfig.jwt.timeLimitAT },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
