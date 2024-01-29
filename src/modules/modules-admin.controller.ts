import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetAuthUser } from "src/auth/decorator/get-auth-user.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/auth/enum/role.enum";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";
import { CreateWebSiteOperatorDto } from "./dto/create-web-site-operator.dto";
import { ModuleListDto } from "./dto/module-list.dto";
import { ReloadCrashDto } from "./dto/reload-crash.dto";
import { ModulesService } from "./modules.service";

@ApiTags('modules (admin)')
@Controller('admin/modules')
@UseGuards(ApimGuard, RolesGuard)
@Roles([Role.SUPER_ADMIN])
export class ModulesAdminController {
    constructor(
        private modulesService: ModulesService
    ) { }

    @Post('website')
    @ApiOperation({
        summary: 'Create operator for website module',
        description:
            'Create operator for website module by admin.'
    })
    async createWebSiteOperatorForUser(
        @Res() res,
        @Body() createWebSiteOperatorDto: CreateWebSiteOperatorDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const webSiteOperator = await this.modulesService.createWebSiteOperator(createWebSiteOperatorDto);

        return res.send(webSiteOperator);
    }

    @Post('website/list')
    @ApiOperation({
        summary: 'Get list of operators of website module',
        description:
            'Get list of operators of website module by admin.'
    })
    async getWebsiteOperatorByAdmin(
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
        @Body() moduleListDto: ModuleListDto,
    ) {
        const webSiteOperators = await this.modulesService.getWebsiteOperatorsByAdmin(moduleListDto);

        return res.send(webSiteOperators);
    }

    
    @Post('crash/reload')
    @ApiOperation({
        summary: 'Reload Crash',
        description:
            'Reload configs and memory data.'
    })
    async reloadCrash(
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
        @Body() reloadCrashDto: ReloadCrashDto,
    ) {
        const webSiteOperators = await this.modulesService.reloadCrash(reloadCrashDto);

        return res.send(webSiteOperators);
    }
}