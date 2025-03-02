import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponse } from "./interceptors/user-response.interceptor";
import { User, UserPayload } from "src/decorators/user.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // router -> /user GET
  @UseGuards(AuthGuard("jwt"))
  @Get()
  @UseInterceptors(UserResponse)
  async getProfile(@User() user: UserPayload) {
    return await this.userService.getProfile(user.id);
  }
}
