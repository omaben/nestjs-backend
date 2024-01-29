import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Log } from 'src/log/log.helper';
import { verify } from 'jsonwebtoken';
import { AuthUser } from '../interfaces/auth-user.interface';
import { TAuthUserCurrentOperators } from '../types/auth-user-current-operators.type';

@Injectable()
export class ApimGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    let authUser: AuthUser;

    if (process.env.LOCAL === 'true') {
      if (req.originalUrl.toLowerCase().indexOf('/auth/') != 0) {
        const bearer = req.headers['bearer'];

        try {
          authUser = verify(bearer, process.env.JWT_SECRET) as AuthUser;
        }
        catch (err) {
          console.log('jwt bearer err :: ', err)
          throw new UnauthorizedException({
            message: 'Token not valid.'
          });
        }
      }

      req.headers['apim-token'] = process.env.APIM_TOKEN;
    }
    else {
      if (req.headers['decoded-bearer']) {
        const decodedJwt = JSON.parse(req.headers['decoded-bearer']);

        console.log('decodedJwt::', decodedJwt);

        authUser = {
          userId: decodedJwt.userId?.[0],
          email: decodedJwt.email?.[0],
          username: decodedJwt.username?.[0],
          roles: decodedJwt.roles,
          moduleRoles: decodedJwt.moduleRoles && JSON.parse(decodedJwt.moduleRoles[0]),
        }
      }
    }

    req.authUser = authUser;

    if (req.headers['current-operators']) {
      const authUserCurrentOperators: TAuthUserCurrentOperators = JSON.parse(req.headers['current-operators']);
      req.authUserCurrentOperators = authUserCurrentOperators;
    }

    const apimToken = req?.headers?.['apim-token'];

    if (process.env.APIM_TOKEN === apimToken) return true;

    Log.error({
      type: 'ApimGuard',
      title: 'ApimGuardError',
      message: 'apimToken is not valid',
      req: req,
      meta: {
        apimToken
      }
    })

    throw new ForbiddenException({
      message: 'APIM token not valid.'
    });
  }
}