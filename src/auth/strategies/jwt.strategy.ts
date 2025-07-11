import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { UserPayload } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('jwtSecret') || '';
    super({
      jwtFromRequest: (req: FastifyRequest) => {
        if (!req?.cookies?.access_token) {
          throw new UnauthorizedException();
        }
        return req.cookies.access_token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: UserPayload) {
    if (!(await this.userService.findOneById(payload._id))) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
