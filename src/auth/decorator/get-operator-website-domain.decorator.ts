import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetOperatorWebsiteDomain = createParamDecorator((data: unknown, ctx: ExecutionContext): String => {
  if (process.env.LOCAL === 'true') {
    return process.env.DEFAULT_OPERATOR_WEBSITE_DOMAIN;
  }

  const req = ctx.switchToHttp().getRequest();

  return req.headers['operator-website-domain'];
})