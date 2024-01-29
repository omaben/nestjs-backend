import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

export enum TransactionSubType {
    NONE = 'NONE',

    DEPOSITE = 'DEPOSITE',

    OPEN = 'OPEN',
    RESULT = 'RESULT',

    ROLEBACK = 'ROLEBACK',
    //WIN = 'WIN',
    //LOST = 'LOST',
    //CASHBACK = 'CASHBACK',
}
