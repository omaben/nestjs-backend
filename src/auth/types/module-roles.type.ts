import { Module } from "../enum/module.enum";
import { Role } from "../enum/role.enum";

export type TModuleRoles = {
  [key in Module]: {
    roles: Role[];
    operator: {
      [key in string]: {
        roles: Role[];
        opId?: string;
        opName?: string;
      }
    }
  };
};

