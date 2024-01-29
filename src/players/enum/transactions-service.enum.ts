import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

export enum TransactionService {
    WEBSITE = 'WEBSITE',
    CPG = 'CPG',
    GAME = 'GAME',
}
