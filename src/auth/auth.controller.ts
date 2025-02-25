import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  InternalServerErrorException,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { RegisterDto } from "./dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { CustomRequest } from "./strategies/local.strategy";
import { Response } from "express";
import { ErrorMessage } from "src/helpers/ErrorMessage";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // router -> /auth
  @Post()
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return await this.authService.register(registerDto, res);
  }

  // router -> /auth/login
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: CustomRequest, @Res() res: Response) {
    return await this.authService.login(req.user, res);
  }

  // router -> /auth/logout
  @UseGuards(AuthGuard("local"))
  @Post("logout")
  async logout(@Res() res: Response) {
    this.authService.logout(res);
    res.send();
  }
}
