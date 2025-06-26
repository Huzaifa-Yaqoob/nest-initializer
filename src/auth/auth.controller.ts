import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { FastifyReply, FastifyRequest } from 'fastify';
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
    @Req() request: FastifyRequest,
  ) {
    console.log(request.cookies, 'asSADSA');
    return await this.authService.register(createUseDto, response, request);
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
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Res({ passthrough: true }) response: FastifyReply) {
    this.authService.logout(response);
  }
}
