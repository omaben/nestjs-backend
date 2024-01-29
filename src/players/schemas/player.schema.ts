import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../auth/enum/role.enum';
import { PlayerKyc } from './player-kyc.schema';
import { PlayerProfile } from './player-profile.schema';
import { PlayerSecurity } from './player-security.schema';
import { PlayerUnique } from './player-unique.schema';
import { PlayerWallet } from './player-wallet.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class Player {
    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true
    })
    userId: string;

    @Prop({
        type: PlayerUnique
    })
    unique: PlayerUnique;

    @Prop({
        type: String,
        required: true,
        index: true,
    })
    opId: string;

    @Prop({
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true
    })
    username: string;

    @Prop({
        type: String,
        index: true,
    })
    refId?: string;

    @Prop({
        type: [String],
        enum: Role
    })
    roles: Role[];

    @Prop({
        type: Boolean,
        required: true,
        index: true,
        default: false
    })
    isDeleted: boolean;

    @Prop({
        type: PlayerProfile,
        required: true
    })
    profile: PlayerProfile;

    @Prop({
        type: PlayerSecurity,
        required: true
    })
    security: PlayerSecurity;

    @Prop({
        type: PlayerKyc,
        required: true
    })
    kyc: PlayerKyc;

    @Prop({
        type: PlayerWallet,
    })
    wallet?: PlayerWallet;

    @Prop({
        type: Date,
        index: true
    })
    createdAt?: Date;

    @Prop({
        type: Date,
        index: true
    })
    updatedAt?: Date;
}
