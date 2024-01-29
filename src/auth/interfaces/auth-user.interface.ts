import { Role } from "../enum/role.enum";
import { TModuleRoles } from "../types/module-roles.type";

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  adminLogin?: boolean;
  roles: Role[];
  moduleRoles: TModuleRoles;
}
