import { Injectable, Req } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto";
import { User } from "src/user/schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

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

  async login(user: User, @Req() req: Request) {
    const payload = { id: user._id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.userService.create(registerDto);
    return await this.login(user, req);
  }
}
