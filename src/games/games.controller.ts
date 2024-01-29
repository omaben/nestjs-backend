import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAuthUserCurrentOperators } from 'src/auth/decorator/get-auth-user-current-operators';
import { GetAuthUser } from 'src/auth/decorator/get-auth-user.decorator';
import { OperatorRoles } from 'src/auth/decorator/operator-roles.decorator';
import { Module } from 'src/auth/enum/module.enum';
import { Role } from 'src/auth/enum/role.enum';
import { ApimGuard } from 'src/auth/guards/apim.guard';
import { OperatorRolesGuard } from 'src/auth/guards/operator-roles.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { TAuthUserCurrentOperators } from 'src/auth/types/auth-user-current-operators.type';
import { AssignGamesToGroupDto } from './dto/assign-games-to-group.dto';
import { CreateGameGroupDto } from './dto/create-game-group.dto';
import { DuplicateGameGroupDto } from './dto/duplicate-game-group.dto';
import { GameGroupListDto } from './dto/game-group-list.dto';
import { GameListDto } from './dto/game-list.dto';
import { GetGameGroupDto } from './dto/get-game-group.dto';
import { GetGameDto } from './dto/get-game.dto';
import { GroupGameListDto } from './dto/group-game-list.dto';
import { SetGameOrderDto } from './dto/set-game-order.dto';
import { ShiftGameOrderDto } from './dto/shift-game-order.dto';
import { UpdateGameGroupDto } from './dto/update-game-group.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
import { GameGroup } from './interfaces/game-group.interface';
import { Game } from './interfaces/game.interface';

@ApiTags('games')
@Controller('games')
@UseGuards(ApimGuard, RolesGuard, OperatorRolesGuard)
export class GamesController {
    constructor(private gamesService: GamesService) { }

    @Post('list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Games List',
        description: `Get list of all games`
    })
    async list(
        @Body() gameListDto: GameListDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<{ count: number, games: Game[] }> {
        return await this.gamesService.list(gameListDto, authUserCurrentOperators.GAME, req);
    }

    @Post('details')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Game Details',
        description: `Get game details.`
    })
    async getGameDetails(
        @Body() getGameDto: GetGameDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<Game> {
        return await this.gamesService.getGameDetails(getGameDto, authUserCurrentOperators.GAME, req);
    }

    @Post('published-list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Published games List',
        description: `Get list of published games`
    })
    async publishedGamelist(
        @Body() gameListDto: GameListDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<{ count: number, games: Game[] }> {
        return await this.gamesService.publishedGamelist(gameListDto, authUserCurrentOperators.GAME, req);
    }

    @Post('update')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Update a game',
        description: `Update a game.`
    })
    async updateGame(
        @Body() updateGameDto: UpdateGameDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators,
        @GetAuthUser() authUser: AuthUser
    ): Promise<Game> {
        return await this.gamesService.updateGame(updateGameDto, authUserCurrentOperators.GAME, authUser, req);
    }

    @Post('group')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Create a game group',
        description: `Create a new game group.`
    })
    async createGameGroup(
        @Body() crateGameGroupDto: CreateGameGroupDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<GameGroup> {
        return await this.gamesService.createGroup(crateGameGroupDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Get game groups',
        description: `Get game groups.`
    })
    async getGameGroups(
        @Body() gameGroupListDto: GameGroupListDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<{ count: number, gameGroups: GameGroup[] }> {
        return await this.gamesService.getGameGroupList(gameGroupListDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/details')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Get a game group details',
        description: `Get a game group details.`
    })
    async getGameGroupDetails(
        @Body() getGameGroupDto: GetGameGroupDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<GameGroup> {
        return await this.gamesService.getGroup(getGameGroupDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/update')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Update a game group',
        description: `Update a game group.`
    })
    async updateGameGroup(
        @Body() updateGameGroupDto: UpdateGameGroupDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<GameGroup> {
        return await this.gamesService.updateGroup(updateGameGroupDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/duplicate')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Duplicate a group',
        description: `Duplicate a group.`
    })
    async duplicateGameGroup(
        @Body() duplicateGameGroupDto: DuplicateGameGroupDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<GameGroup> {
        return await this.gamesService.duplicateGameGroup(duplicateGameGroupDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/assign-games')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Assign games to group',
        description: `Assign games to group.`
    })
    async assignGamesToGroup(
        @Body() assignGamesToGroupDto: AssignGamesToGroupDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<GameGroup> {
        return await this.gamesService.assignGamesToGroup(assignGamesToGroupDto, authUserCurrentOperators.GAME, req);
    }

    @Post('group/game-list')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'List of games of a group',
        description: `List of games of a group.`
    })
    async getGamesOfGroup(
        @Body() groupGameListDto: GroupGameListDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<{ count: number, games: Game[] }> {
        return await this.gamesService.getGamesOfGroup(groupGameListDto, authUserCurrentOperators.GAME, req);
    }

    @Post('set-order')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Set game order',
        description: `Set game order.`
    })
    async setGameOrder(
        @Body() setGameOrderDto: SetGameOrderDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<Game> {
        return await this.gamesService.setGameOrder(setGameOrderDto, authUserCurrentOperators.GAME, req);
    }

    @Post('shift-order')
    @OperatorRoles({ module: Module.WEBSITE, roles: [Role.SUPER_ADMIN, Role.ADMIN] })
    @ApiOperation({
        summary: 'Shift game order',
        description: `Shift the game order.`
    })
    async shiftGameOrder(
        @Body() shiftGameOrderDto: ShiftGameOrderDto,
        @Req() req,
        @GetAuthUserCurrentOperators() authUserCurrentOperators: TAuthUserCurrentOperators
    ): Promise<Game> {
        return await this.gamesService.shiftGameOrder(shiftGameOrderDto, authUserCurrentOperators.GAME, req);
    }
}