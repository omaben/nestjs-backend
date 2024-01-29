import { SetMetadata } from '@nestjs/common';
import { ModuleOperatorRoles } from '../types/module-operator-roles.type';

export const OPERATOR_ROLE_KEY = 'operator_roles';
export const OperatorRoles = (moduleOperatorRoles: ModuleOperatorRoles) => SetMetadata(OPERATOR_ROLE_KEY, moduleOperatorRoles);