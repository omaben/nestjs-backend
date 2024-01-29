import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ModulesAdminController } from "./modules-admin.controller";
import { ModulesController } from "./modules.controller";
import { ModulesService } from "./modules.service";

@Module({
    imports: [
        JwtModule
    ],
    controllers: [
        ModulesController,
        ModulesAdminController,
    ],
    providers: [
        ModulesService
    ],
    exports: [
        ModulesService
    ]
})

export class ModulesModule { }