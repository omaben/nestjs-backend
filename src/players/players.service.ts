import { Injectable } from "@nestjs/common";
import { Module } from "src/auth/enum/module.enum";
import { callModuleApi } from "src/common/helpers/api.helper";
import { CrashLogsByBetDto } from "src/crash-logs/dto/crash-logs-by-bet-dto";
import { ChangePlayerPasswordDto } from "./dto/change-player-password.dto";
import { PlayerDetailsDto } from "./dto/player-details.dto";
import { PlayerListDto } from "./dto/player-list.dto";
import { ResetPlayerPasswordDto } from "./dto/reset-player-password.dto";
import { SetPlayerAdminPasswordDto } from "./dto/set-player-admin-password.dto";
import { TransactionListDto } from "./dto/transaction-list.dto";
import { PlayerSummary } from "./interfaces/player-summary.interface";
import { Transaction } from "./interfaces/transaction.interface";
import { Player } from "./schemas/player.schema";

@Injectable()
export class PlayersService {
    constructor() { }

    async list(playerListDto: PlayerListDto, opId: string, req: any): Promise<{ count: number, players: Player[] }> {
        const { count, users: players } = await callModuleApi(
            Module.WEBSITE,
            'post',
            `portal/users/list`,
            { ...playerListDto, opId }
        );

        return { count, players };
    }

    async details(playerDetailsDto: PlayerDetailsDto, opId: string, req: any): Promise<PlayerSummary> {
        const { user: player } = await callModuleApi(
            Module.WEBSITE,
            'post',
            `portal/users/details`,
            { ...playerDetailsDto, opId }
        );

        return player;
    }

    async getTransactionList(
        transactionListDto: TransactionListDto,
        opId: string,
        req: any
    ): Promise<{ count: number, transactions: Transaction[] }> {
        const { count, transactions } = await callModuleApi(
            Module.WEBSITE,
            'post',
            `/portal/transactions/list`,
            { ...transactionListDto, opId }
        );

        return { count, transactions };
    }

    async setPlayerAdminPassword(
        setPlayerAdminPasswordDto: SetPlayerAdminPasswordDto,
        opId: string,
        req: any
    ): Promise<void> {
        await callModuleApi(
            Module.WEBSITE,
            'post',
            `/portal/users/set-admin-password`,
            { ...setPlayerAdminPasswordDto, opId }
        );
    }

    async changePlayerPassword(
        changePlayerPasswordDto: ChangePlayerPasswordDto,
        opId: string,
        req: any
    ): Promise<void> {
        await callModuleApi(
            Module.WEBSITE,
            'post',
            `/portal/users/set-user-password`,
            { ...changePlayerPasswordDto, opId }
        );
    }

    async resetPlayerPassword(
        resetPlayerPasswordDto: ResetPlayerPasswordDto,
        opId: string,
        req: any
    ): Promise<void> {
        await callModuleApi(
            Module.WEBSITE,
            'post',
            `/portal/users/reset-user-password`,
            { ...resetPlayerPasswordDto, opId }
        );
    }
}

