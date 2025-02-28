import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import generalConfig from "src/config/general.config";
import { ErrorMessage } from "src/helpers/ErrorMessage";
import { UserPayload } from "src/decorators/user.decorator";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(account: string, password: string) {
    const user = await this.userService.findOneByAccount(account);
    if (!user) {
      throw new NotFoundException(
        new ErrorMessage("account", "User is not found with that account.")
      );
    }
    if (!(await user.comparePassword(password))) {
      throw new BadRequestException(
        new ErrorMessage("password", "Your password is incorrect.")
      );
    }
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async login(userPayload: UserPayload, res: Response) {
    const accessToken = this.jwtService.sign(userPayload);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: generalConfig.environment === "production",
      maxAge: generalConfig.jwt.timeLimitInMSec,
    });
    res.redirect(307, "/user");
    return;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const user = await this.userService.create(registerDto);
    const payloadConverted: UserPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    return await this.login(payloadConverted, res);
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
