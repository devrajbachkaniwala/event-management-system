import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetOrgId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user.orgId;
  }
);
