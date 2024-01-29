import { Module } from "../enum/module.enum";
import { Role } from "../enum/role.enum";

export type ModuleOperatorRoles = {
    module: Module;
    roles: Role[];
}