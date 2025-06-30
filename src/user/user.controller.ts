import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserPayload } from '../decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@User() userPayload: UserPayload) {
    return await this.userService.findOneById(userPayload?._id);
  }
}
