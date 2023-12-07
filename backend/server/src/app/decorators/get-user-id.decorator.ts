import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dto';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const reqUser = request.user as { user: UserDto };

    return reqUser.user.id;
  }
);
