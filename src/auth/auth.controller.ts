import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth/register/ POST
  @Post('register')
  async create(@Body() createUseDto: CreateUserDto) {
    return await this.authService.register(createUseDto);
  }

  // auth/login/ POST
  @Post('login')
  findAll(@Body() loginUserDto: LoginUserDto) {}

  // auth/logout/ GET
  @Get('logout')
  update() {}
}
