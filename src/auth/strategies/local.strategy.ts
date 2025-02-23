import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "account",
      passwordField: "password",
    });
  }

  async validate(account: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(account, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// this type defines that user will always be defined and it just exclude the undefined type from user because i am already checking that in auth guard strategy local
export interface CustomRequest extends Request {
  user: User;
}
