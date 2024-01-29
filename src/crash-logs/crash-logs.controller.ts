import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetAuthUserCurrentOperators } from "src/auth/decorator/get-auth-user-current-operators";
import { OperatorRoles } from "src/auth/decorator/operator-roles.decorator";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Module } from "src/auth/enum/module.enum";
import { Role } from "src/auth/enum/role.enum";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { OperatorRolesGuard } from "src/auth/guards/operator-roles.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { TAuthUserCurrentOperators } from "src/auth/types/auth-user-current-operators.type";
import { CrashLogsService } from "./crash-logs.service";
import { CrashLogsByBetDto } from "./dto/crash-logs-by-bet-dto";
import { CrashLog } from "./interfaces/crash-log.interface";

@ApiTags('crash-logs')
@Controller('crash/logs')
@UseGuards(ApimGuard, RolesGuard, OperatorRolesGuard)
export class CrashLogsController {
    constructor(
        private crashLogsService: CrashLogsService
    ) { }

    @Post('by-bet')
    @OperatorRoles({ module: Module.CRASH, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Crash logs by bet',
        description:
            'Get player Crash logs by bet.'
    })
    async list(
        @Req() req,
        @Res() res,
        @Body() crashLogsByBetDto: CrashLogsByBetDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<CrashLog[]> {
        const crashLogs = await this.crashLogsService.logsByBet(crashLogsByBetDto, authUserCurrentOperators.CRASH);

        return res.send(crashLogs);
    }
}