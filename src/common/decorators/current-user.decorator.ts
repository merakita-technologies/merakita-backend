import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Check if it's a GraphQL context
    const gqlCtx = GqlExecutionContext.create(ctx);
    if (gqlCtx) {
      const request = gqlCtx.getContext().req;
      return request?.user;
    }
    // Fallback to HTTP context
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);