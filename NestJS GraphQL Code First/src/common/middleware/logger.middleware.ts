import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

// @info: only for return to client
export const loggerMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  return value.toLocaleUpperCase();
};
