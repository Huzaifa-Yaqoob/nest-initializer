import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { UserPayload } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const jwtRefreshSecret =
      configService.get<string>('jwtRefreshSecret') || '';
    super({
      jwtFromRequest: (req: FastifyRequest) => {
        if (!req?.cookies?.refresh_token) {
          throw new UnauthorizedException('Missing refresh token');
        }
        return req.cookies.refresh_token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret,
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.userService.findOneById(payload._id);
    if (!user) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    return { _id: payload._id };
  }
}
