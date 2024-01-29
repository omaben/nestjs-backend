import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetAuthUser } from "src/auth/decorator/get-auth-user.decorator";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";
import { ModuleListDto } from "./dto/module-list.dto";
import { ModulesService } from "./modules.service";


@ApiTags('modules')
@Controller('modules')
@UseGuards(ApimGuard, RolesGuard)
export class ModulesController {
    constructor(
        private modulesService: ModulesService
    ) { }

    @Post('website/list')
    //@Roles([Role.OPERATOR])
    @ApiOperation({
        summary: 'Get list of operators of website module',
        description:
            'Get list of operators of website module by operator.'
    })
    async getWebsiteOperatorByUser(
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
        @Body() moduleListDto: ModuleListDto,
    ) {
        const webSiteOperators = await this.modulesService.getWebsiteOperatorsByUser(moduleListDto, authUser);

        return res.send(webSiteOperators);
    }
}