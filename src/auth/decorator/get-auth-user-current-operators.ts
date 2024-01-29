import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TAuthUserCurrentOperators } from "../types/auth-user-current-operators.type";

export const GetAuthUserCurrentOperators = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TAuthUserCurrentOperators => {
    const req = ctx.switchToHttp().getRequest();

    const authUserCurrentOperators: TAuthUserCurrentOperators = req.authUserCurrentOperators;

    if (!authUserCurrentOperators) {
      throw new UnauthorizedException({ message: 'The current operator not valid.' });
    }

    return authUserCurrentOperators;
  }
)