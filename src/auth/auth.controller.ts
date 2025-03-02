import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { RegisterDto } from "./dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { User, UserPayload } from "src/decorators/user.decorator";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // router -> /auth POST
  @Post()
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.register(registerDto, res);
  }

  // router -> /auth GET
  @Get()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.validateRefreshToken(req, res);
  }

  // router -> /auth/login POST
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(
    @User() user: UserPayload,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.login(user, res);
  }

  // router -> /auth/logout GET
  @UseGuards(AuthGuard("jwt"))
  @Get("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
  }
}
