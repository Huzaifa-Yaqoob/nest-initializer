import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { SignInUserDto } from "./dto/sign-in-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { UserResponse } from "./interceptors/user-response.interceptor";

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // router -> /
  @Post()
  @UseInterceptors(UserResponse)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  // router -> /sign-in
  @Post("sign-in")
  @UseInterceptors(UserResponse)
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const user = await this.userService.signIn(signInUserDto);
    return user;
  }

  // router -> /verify
  @Post("verify")
  @UseInterceptors(UserResponse)
  async verify(@Body() verifyUserDto: VerifyUserDto) {
    const user = await this.userService.verifyUser(verifyUserDto.token);
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
