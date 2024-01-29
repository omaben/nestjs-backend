import { LogSeverity } from "../enum/crash-severity.enum";
import { LogType } from "../enum/log-type.enum";

export interface CrashLog {
    uuid: string;
    server: string;
    severity: LogSeverity;
    type: LogType;
    title: string;
    description?: string;
    meta?: any;
    playerId?: string;
    roundMd5?: string;
    roundIndex?: number;
    opId?: string;
    timestamp?: Date;
    enqueuedTimeUtc?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    partitionKey: string;
}