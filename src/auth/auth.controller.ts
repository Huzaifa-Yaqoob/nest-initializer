import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { User, UserPayload } from '../decorators';
import { SingleUserDataInterceptor } from '../transformers/single-user-data.transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth/register/ POST
  @Post('register')
  @UseInterceptors(SingleUserDataInterceptor)
  async create(
    @Body() createUseDto: CreateUserDto,
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() request: FastifyRequest,
  ) {
    return await this.authService.register(createUseDto, response, request);
  }

  // auth/login/ POST
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(SingleUserDataInterceptor)
  @Post('login')
  async login(
    @User() userPayload: UserPayload,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return await this.authService.login(userPayload, response);
  }

  // auth/logout/ GET
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Res({ passthrough: true }) response: FastifyReply) {
    this.authService.logout(response);
  }
}
