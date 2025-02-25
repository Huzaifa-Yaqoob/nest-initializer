import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto";
import { User } from "src/user/schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import generalConfig from "src/config/general.config";
import { Payload } from "./types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(account: string, password: string) {
    const user = await this.userService.findOne(account);
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async login(user: User, res: Response) {
    const payload: Payload = { id: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: generalConfig.environment === "production",
      maxAge: generalConfig.jwt.timeLimitInMSec,
    });
    res.send();
  }

  async register(registerDto: RegisterDto, res: Response) {
    const user = await this.userService.create(registerDto);
    return await this.login(user, res);
  }

  async logout(res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      expires: new Date(0),
    });
  }
}
