import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
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
    this.saveAccessToken(userPayload, res);
    this.saveRefreshToken(userPayload, res);
    return { message: "Login Success" };
  }

  saveAccessToken(userPayload: UserPayload, res: Response) {
    const accessToken = this.jwtService.sign(userPayload, {
      secret: generalConfig.jwt.secretAT,
      expiresIn: generalConfig.jwt.timeLimitAT,
    });
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: !generalConfig.development,
      maxAge: generalConfig.jwt.timeLimitInMSecAT,
    });
  }

  saveRefreshToken(userPayload: UserPayload, res: Response) {
    const refreshToken = this.jwtService.sign(userPayload, {
      secret: generalConfig.jwt.secretRT,
      expiresIn: generalConfig.jwt.timeLimitRT,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: !generalConfig.development,
      maxAge: generalConfig.jwt.timeLimitInMSecRT,
    });
  }

  async validateRefreshToken(req: Request, res: Response) {
    const refreshToken = req?.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(
        new ErrorMessage("general", "You don`t have refresh token.")
      );
    }

    const payload = this.jwtService.verify<
      UserPayload & { iat: number; exp: number }
    >(refreshToken, {
      secret: generalConfig.jwt.secretRT,
    });

    if (!(await this.userService.findOneById(payload.id))) {
      throw new NotFoundException(
        new ErrorMessage("general", "Unable to find your account.")
      );
    }

    const { iat, exp, ...userPayload } = payload;

    this.saveAccessToken(userPayload, res);
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
      secure: !generalConfig.development,
      sameSite: "none",
      expires: new Date(0),
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: !generalConfig.development,
      sameSite: "none",
      expires: new Date(0),
    });
  }
}
