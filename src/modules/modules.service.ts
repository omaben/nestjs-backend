import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Module } from "src/auth/enum/module.enum";
import { Role } from "src/auth/enum/role.enum";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";
import { callModuleApi } from "src/common/helpers/api.helper";
import { CreateWebSiteOperatorDto } from "./dto/create-web-site-operator.dto";
import { ModuleListDto } from "./dto/module-list.dto";
import { ReloadCrashDto } from "./dto/reload-crash.dto";


@Injectable()
export class ModulesService {
    constructor(
        private jwtService: JwtService
    ) { }

    async createWebSiteOperator(createWebSiteOperatorDto: CreateWebSiteOperatorDto): Promise<void> {
        // TODO const newGameOperator : WebsiteOperator = await callModuleApi(
        const newGameOperator = await callModuleApi(
            Module.GAME,
            'post',
            `operators`,
            createWebSiteOperatorDto
        );

        const webhookToken = this.jwtService.sign(
            {
                roles: [Role.CPG_SERVICE]
            },
            {
                expiresIn: '10 years',
                secret: process.env.MODULE_WEBSITE_JWT_SECRET
            }
        );

        const newCpgOperator = await callModuleApi(
            Module.CPG,
            'post',
            `module/operators`,
            {
                name: createWebSiteOperatorDto.name,
                webhook: `${createWebSiteOperatorDto.domains[0]}/transactions/cpg-webhook`,
                webhookToken: webhookToken
            }
        );

        const newCrashOperator = await callModuleApi(
            Module.CRASH,
            'post',
            `operators`,
            {
                name: createWebSiteOperatorDto.name,
                baseUrl: createWebSiteOperatorDto.domains[0],
            }
        );

        const newWebsiteOperator = await callModuleApi(
            Module.WEBSITE,
            'post',
            `operators`,
            {
                ...createWebSiteOperatorDto,
                gameToken: newGameOperator.token,
                gameOpId: newGameOperator.opId,
                cpgToken: newCpgOperator.token,
                cpgOpId: newCpgOperator.opId,
                crashToken: newCrashOperator.opToken,
                crashOpId: newCrashOperator.opId,
            }
        );

        return newWebsiteOperator;
    }

    async getWebsiteOperatorsByAdmin(moduleListDto: ModuleListDto): Promise<any> {
        const { count, operators } = await callModuleApi(
            Module.WEBSITE,
            'post',
            `operators/list`,
            moduleListDto
        );

        for (const operator of operators) {
            operator['current-operators'] = {
                [Module.WEBSITE]: operator.opId,
                [Module.GAME]: operator.gameOpId,
                [Module.CPG]: operator.cpgOpId,
            }
        }

        return { count, operators };
    }

    async getWebsiteOperatorsByUser(moduleListDto: ModuleListDto, authUser: AuthUser): Promise<any> {
        let operatorIds: string[] = [];

        if (
            (authUser?.roles?.length)
            || (authUser?.moduleRoles?.WEBSITE?.roles?.length)
            || (authUser?.moduleRoles?.WEBSITE?.operator)
        ) {
            for (const opId in authUser.moduleRoles.WEBSITE.operator) {
                operatorIds.push(opId);
            }
        }

        if (operatorIds.length === 0) return { count: 0, operators: [] };

        moduleListDto.find = {
            ...moduleListDto.find,
            operatorIds: operatorIds
        }

        let { count, operators } = await callModuleApi(
            Module.WEBSITE,
            'post',
            `operators/list`,
            moduleListDto
        );

        for (const operator of operators) {
            operator['current-operators'] = {
                [Module.WEBSITE]: operator.opId,
                [Module.GAME]: operator.gameOpId,
                [Module.CPG]: operator.cpgOpId,
                [Module.CRASH]: operator.crashOpId,
            }
        }

        return { count, operators };
    }

    async reloadCrash(reloadCrashDto: ReloadCrashDto): Promise<any> {
        const reloadCrashResult = await callModuleApi(
            Module.CRASH,
            'post',
            `operators/reload`,
            {
                options: reloadCrashDto.options
            }
        );
    }
}

