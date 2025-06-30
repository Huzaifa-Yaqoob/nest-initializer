import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../decorators';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(createUserDto: CreateUserDto, response: FastifyReply) {
    const newUser = await this.userService.create(createUserDto);
    const userPayload: UserPayload = {
      _id: (newUser._id as Types.ObjectId).toString(),
    };
    return await this.login(userPayload, response);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.loginUser(email, password);
    return user || null;
  }

  async login(userPayload: UserPayload, response: FastifyReply) {
    this.saveAccessToken(userPayload, response);
    this.saveRefreshToken(userPayload, response);
    return await this.userService.findOneById(userPayload._id);
  }

  async refreshAToken(userPayload: UserPayload, response: FastifyReply) {
    const user = await this.userService.findOneById(userPayload._id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.saveAccessToken(userPayload, response);

    return user;
  }

  saveAccessToken(userPayload: UserPayload, response: FastifyReply) {
    const accessToken = this.jwtService.sign(userPayload);

    response.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: this.configService.get<number>('accessCookieExpiresIn'),
      sameSite: 'none',
      partitioned: true,
    });
    return accessToken;
  }

  saveRefreshToken(userPayload: UserPayload, response: FastifyReply) {
    const refreshToken = this.jwtService.sign(userPayload, {
      expiresIn: this.configService.get<string>('refreshJwtExpiresIn'),
      secret: this.configService.get<string>('jwtRefreshSecret'),
    });

    response.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: this.configService.get<number>('refreshCookieExpiresIn'),
      sameSite: 'none',
      partitioned: true,
    });
    return refreshToken;
  }

  logout(response: FastifyReply) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<boolean>('isProduction'),
      sameSite: 'none',
      expires: new Date(0),
      partitioned: false,
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<boolean>('isProduction'),
      sameSite: 'none',
      expires: new Date(0),
      partitioned: false,
    });
    return { message: 'logout successful' };
  }
}
