import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  id: number;
  email: string;
  role: string;
  status: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return request.user;
  },
);
