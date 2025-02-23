import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from "@nestjs/common";
import { RegisterDto, VerifyTokenDto } from "./dto";
import { UserResponse } from "./interceptors/user-response.interceptor";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { CustomRequest } from "./strategies/local.strategy";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // router -> /auth
  @Post()
  async register(@Body() registerDto: RegisterDto, @Req() req: CustomRequest) {
    const ab = await this.authService.register(registerDto, req);
    return ab;
  }

  // router -> /auth/login
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: CustomRequest) {
    return await this.authService.login(req.user, req);
  }

  // router -> /auth/verify
  @Post("verify")
  @UseInterceptors(UserResponse)
  verify(@Body() registerAuthDTO: VerifyTokenDto) {
    return;
  }
}
