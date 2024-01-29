import { Injectable } from '@nestjs/common';
import { GameListDto } from './dto/game-list.dto';
import { Game } from './interfaces/game.interface';
import { callModuleApi } from 'src/common/helpers/api.helper';
import { Module } from 'src/auth/enum/module.enum';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameGroup } from './interfaces/game-group.interface';
import { CreateGameGroupDto } from './dto/create-game-group.dto';
import { AssignGamesToGroupDto } from './dto/assign-games-to-group.dto';
import { SetGameOrderDto } from './dto/set-game-order.dto';
import { DuplicateGameGroupDto } from './dto/duplicate-game-group.dto';
import { GetGameGroupDto } from './dto/get-game-group.dto';
import { GameGroupListDto } from './dto/game-group-list.dto';
import { GroupGameListDto } from './dto/group-game-list.dto';
import { ShiftGameOrderDto } from './dto/shift-game-order.dto';
import { GetGameDto } from './dto/get-game.dto';
import { UpdateGameGroupDto } from './dto/update-game-group.dto';

@Injectable()
export class GamesService {
    constructor() { }

    async list(gameListDto: GameListDto, opId: string, req: any): Promise<{ count: number, games: Game[] }> {
        const { count, games } = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/list`,
            { ...gameListDto, opId }
        );

        return { count, games };
    }

    async getGameDetails(getGameDto: GetGameDto, opId: string, req: any): Promise<Game> {
        const game = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/details`,
            { ...getGameDto, opId }
        );

        return game;
    }

    async getGameGroupList(gameGroupListDto: GameGroupListDto, opId: string, req: any): Promise<{ count: number, gameGroups: GameGroup[] }> {
        const { count, gameGroups } = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/list`,
            { ...gameGroupListDto, opId }
        );

        return { count, gameGroups };
    }

    async publishedGamelist(gameListDto: GameListDto, opId: string, req: any): Promise<{ count: number, games: Game[] }> {
        const { count, games } = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/published-list`,
            { ...gameListDto, opId }
        );

        return { count, games };
    }

    async updateGame(updateGameDto: UpdateGameDto, opId: string, authUser, req: any): Promise<Game> {
        const game = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games`,
            {
                ...updateGameDto,
                by: authUser,
                opId
            }
        );

        return game;
    }

    async createGroup(createGameGroupDto: CreateGameGroupDto, opId: string, req: any): Promise<GameGroup> {
        const gameGroup = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group`,
            { ...createGameGroupDto, opId }
        );

        return gameGroup;
    }

    async getGroup(getGameGroupDto: GetGameGroupDto, opId: string, req: any): Promise<GameGroup> {
        const gameGroup = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/details`,
            { ...getGameGroupDto, opId }
        );

        return gameGroup;
    }

    async updateGroup(updateGameGroupDto: UpdateGameGroupDto, opId: string, req: any): Promise<GameGroup> {
        const gameGroup = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/update`,
            { ...updateGameGroupDto, opId }
        );

        return gameGroup;
    }

    async duplicateGameGroup(duplicateGameGroupDto: DuplicateGameGroupDto, opId: string, req: any): Promise<GameGroup> {
        const gameGroup = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/duplicate`,
            { ...duplicateGameGroupDto, opId }
        );

        return gameGroup;
    }

    async assignGamesToGroup(assignGamesToGroupDto: AssignGamesToGroupDto, opId: string, req: any): Promise<GameGroup> {
        const gameGroup = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/assign-games`,
            { ...assignGamesToGroupDto, opId }
        );

        return gameGroup;
    }

    async getGamesOfGroup(groupGameListDto: GroupGameListDto, opId: string, req: any): Promise<{ count: number, games: Game[] }> {
        const { count, games } = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/group/game-list`,
            { ...groupGameListDto, opId }
        );

        return { count, games };
    }

    async setGameOrder(setGameOrderDto: SetGameOrderDto, opId: string, req: any): Promise<Game> {
        const game = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/set-order`,
            { ...setGameOrderDto, opId }
        );

        return game;
    }

    async shiftGameOrder(shiftGameOrderDto: ShiftGameOrderDto, opId: string, req: any): Promise<Game> {
        const game = await callModuleApi(
            Module.GAME,
            'post',
            `portal/games/shift-order`,
            { ...shiftGameOrderDto, opId }
        );

        return game;
    }
}