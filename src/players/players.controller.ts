import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Role } from "../auth/enum/role.enum";
import { PlayersService } from "./players.service";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OperatorRolesGuard } from "src/auth/guards/operator-roles.guard";
import { OperatorRoles } from "src/auth/decorator/operator-roles.decorator";
import { Module } from "src/auth/enum/module.enum";
import { GetAuthUserCurrentOperators } from "src/auth/decorator/get-auth-user-current-operators";
import { TAuthUserCurrentOperators } from "src/auth/types/auth-user-current-operators.type";
import { Player } from "./schemas/player.schema";
import { PlayerListDto } from "./dto/player-list.dto";
import { PlayerDetailsDto } from "./dto/player-details.dto";
import { TransactionListDto } from "./dto/transaction-list.dto";
import { SetPlayerAdminPasswordDto } from "./dto/set-player-admin-password.dto";
import { ChangePlayerPasswordDto } from "./dto/change-player-password.dto";
import { ResetPlayerPasswordDto } from "./dto/reset-player-password.dto";

@ApiTags('players')
@Controller('players')
@UseGuards(ApimGuard, RolesGuard, OperatorRolesGuard)
export class PlayersController {
    constructor(
        private playersService: PlayersService,
    ) { }

    @Post('list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Player List',
        description: `Get list of players`
    })
    async list(
        @Body() playerListDto: PlayerListDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<{ count: number, players: Player[] }> {
        const { count, players } = await this.playersService.list(playerListDto, authUserCurrentOperators.WEBSITE, req);
        return { count, players };
    }

    @Post('details')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Get player details',
        description:
            'Get player details.'
    })
    async getPlayerDetails(
        @Req() req,
        @Res() res,
        @Body() playerDetailsDto: PlayerDetailsDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ) {
        const player = await this.playersService.details(playerDetailsDto, authUserCurrentOperators.WEBSITE, req);
        res.send(player);
    }

    @Post('transactions/list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Get player transactions',
        description:
            'Get player transactions.'
    })
    async getPlayerTransactions(
        @Req() req,
        @Res() res,
        @Body() transactionListDto: TransactionListDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ) {
        const transactionList = await this.playersService.getTransactionList(transactionListDto, authUserCurrentOperators.WEBSITE, req);
        res.send(transactionList);
    }

    @Post('set-admin-password')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Set admin password',
        description:
            'Set admin password.'
    })
    async setAdminPassword(
        @Req() req,
        @Res() res,
        @Body() setPlayerAdminPasswordDto: SetPlayerAdminPasswordDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ) {
        await this.playersService.setPlayerAdminPassword(setPlayerAdminPasswordDto, authUserCurrentOperators.WEBSITE, req);
        res.send();
    }

    @Post('set-password')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Set user password by admin',
        description:
            'Set user password by admin.'
    })
    async setPlayerPassword(
        @Req() req,
        @Res() res,
        @Body() changePlayerPasswordDto: ChangePlayerPasswordDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ) {
        await this.playersService.changePlayerPassword(changePlayerPasswordDto, authUserCurrentOperators.WEBSITE, req);
        res.send();
    }

    @Post('reset-password')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Change user password and send to user',
        description:
            'Change user password and send to the user email.'
    })
    async resetPlayerPassword(
        @Req() req,
        @Res() res,
        @Body() resetPlayerPasswordDto: ResetPlayerPasswordDto,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ) {
        await this.playersService.resetPlayerPassword(resetPlayerPasswordDto, authUserCurrentOperators.WEBSITE, req);
        res.send();
    }
}