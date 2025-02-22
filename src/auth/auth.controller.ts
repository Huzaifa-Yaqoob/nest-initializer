import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import {
  RegisterCredentialsDto,
  VerifyTokenDto,
  SignInCredentialsDto,
} from "./dto";
import { UserResponse } from "./interceptors/user-response.interceptor";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly userService: UserService) {}

  // router -> /auth
  @Post()
  @UseInterceptors(UserResponse)
  register(@Body() registerAuthDTO: RegisterCredentialsDto) {
    return this.userService.create(registerAuthDTO);
  }

  // router -> /auth/sign-in
  @Post("sign-in")
  @UseInterceptors(UserResponse)
  signIn(@Body() registerAuthDTO: SignInCredentialsDto) {
    return this.userService.signIn(registerAuthDTO);
  }

  // router -> /auth/verify
  @Post("verify")
  @UseInterceptors(UserResponse)
  verify(@Body() registerAuthDTO: VerifyTokenDto) {
    return this.userService.verifyUser(registerAuthDTO.token);
  }
}
