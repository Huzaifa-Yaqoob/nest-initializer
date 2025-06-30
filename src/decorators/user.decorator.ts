import { FastifyReply } from 'fastify';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserPayload = { _id: string };
export interface ExtendedFastifyReply extends FastifyReply {
  user: UserPayload;
}

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: ExtendedFastifyReply = ctx
      .switchToHttp()
      .getRequest<ExtendedFastifyReply>();
    return request.user;
  },
);
