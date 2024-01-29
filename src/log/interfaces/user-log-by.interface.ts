import { Role } from "src/auth/enum/role.enum";
import { TModuleRoles } from "src/auth/types/module-roles.type";

export interface UserLogBy {
    userId?: string;
    username?: string;
    adminLogin?: boolean;
    roles?: Role[];
    moduleRoles?: TModuleRoles
}
