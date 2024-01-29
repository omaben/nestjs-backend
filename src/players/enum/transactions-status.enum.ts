import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

export enum TransactionStatus {
    NONE = 'NONE',
    VERIFIED = 'VERIFIED',
}
