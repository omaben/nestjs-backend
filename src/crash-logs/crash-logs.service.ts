import { Injectable } from '@nestjs/common';
import { CrashLogsByBetDto } from './dto/crash-logs-by-bet-dto';
import { Module } from 'src/auth/enum/module.enum';
import { callModuleApi } from 'src/common/helpers/api.helper';
import { CrashLog } from './interfaces/crash-log.interface';

@Injectable()
export class CrashLogsService {
    constructor(
    ) { }

    async logsByBet(crashLogsByBetDto: CrashLogsByBetDto, opId: string): Promise<CrashLog[]> {
        const crashLogs = await callModuleApi(
            Module.CRASHLOGS,
            'post',
            `portal/crash-logs/by-bet`,
            { ...crashLogsByBetDto, opId }
        );

        return crashLogs;
    }
}

