import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "../interfaces/auth-user.interface";

export const GetAuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest();

  return req.authUser;
})