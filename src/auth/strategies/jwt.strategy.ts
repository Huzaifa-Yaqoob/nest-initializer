import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import generalConfig from "src/config/general.config";
import { Request } from "express";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { UserPayload } from "src/decorators/user.decorator";
import { UserService } from "src/user/user.service";
import { ErrorMessage } from "src/helpers/ErrorMessage";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req?.cookies?.access_token) {
          throw new UnauthorizedException(
            new ErrorMessage("general", "You don`t have access token.")
          );
        }
        return req.cookies.access_token;
      },
      ignoreExpiration: false,
      secretOrKey: generalConfig.jwt.secretAT,
    });
  }

  async validate(payload: UserPayload) {
    if (!(await this.userService.findOneById(payload.id))) {
      throw new NotFoundException(
        new ErrorMessage("general", "User is not found with that email.")
      );
    }
    return payload;
  }
}
