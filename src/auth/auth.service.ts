import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    return newUser;
  }

  login() {
    return `This action returns all auth`;
  }

  logout(id: number) {
    return `This action removes a #${id} auth`;
  }
}
