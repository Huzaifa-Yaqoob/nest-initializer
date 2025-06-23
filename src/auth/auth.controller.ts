import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UserPayload } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth/register/ POST
  @Post('register')
  async create(
    @Body() createUseDto: CreateUserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return await this.authService.register(createUseDto, response);
  }

  // auth/login/ POST
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(
    @User() userPayload: UserPayload,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.authService.login(userPayload, response);
  }

  // auth/logout/ GET
  @Get('logout')
  update(@Req() request: FastifyRequest, @Res() response: FastifyReply) {}
}
