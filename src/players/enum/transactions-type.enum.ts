import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

export enum TransactionType {
    BET = 'BET',
    DEPOSITE = 'DEPOSITE',
    WITHDRAW = 'WITHDRAW',
}
