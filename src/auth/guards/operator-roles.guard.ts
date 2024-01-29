import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OPERATOR_ROLE_KEY } from '../decorator/operator-roles.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';
import { TAuthUserCurrentOperators } from '../types/auth-user-current-operators.type';
import { ModuleOperatorRoles } from '../types/module-operator-roles.type';

@Injectable()
export class OperatorRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredModuleRoles = this.reflector.getAllAndOverride<ModuleOperatorRoles>(OPERATOR_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModuleRoles) {
      return true;
    }

    const authUser: AuthUser = context.switchToHttp().getRequest().authUser;

    if (authUser?.roles?.length && authUser?.roles.some(role => requiredModuleRoles.roles.includes(role))) return true;

    if (
      authUser?.moduleRoles?.[requiredModuleRoles.module]?.roles?.length
      && authUser?.moduleRoles[requiredModuleRoles.module].roles.some(role => requiredModuleRoles.roles.includes(role))
    ) return true;

    const req = context.switchToHttp().getRequest();

    const authUserCurrentOperators: TAuthUserCurrentOperators = req.authUserCurrentOperators;

    if (!authUserCurrentOperators) return false;

    const currentModuleOperatorId = authUserCurrentOperators[requiredModuleRoles.module];

    const authUserRolesOnCurrentModuleOperator =
      authUser?.moduleRoles?.[requiredModuleRoles.module]?.operator?.[currentModuleOperatorId]?.roles;

    if (!authUserRolesOnCurrentModuleOperator) return false;

    return authUserRolesOnCurrentModuleOperator.some(role => requiredModuleRoles.roles.includes(role));
  }
}