import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Currency } from 'src/common/enum/currency.enum';
import { PlayerGender } from '../enum/player-gender.enum';
import { PlayerLocation } from './player-location.schema';
import { PlayerProfileVerification } from './player-profile-verification.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerProfile {
    @Prop({
        type: String,
        index: true,
    })
    firstname?: string;

    @Prop({
        type: String,
        index: true,
    })
    lastname?: string;

    @Prop({
        type: String,
        index: true,
    })
    nickName?: string;

    @Prop({
        type: String,
        index: true,
    })
    fullname?: string;

    @Prop({
        type: Date,
        index: true,
    })
    birthDate?: Date;

    @Prop({
        type: String,
    })
    avatar?: string;

    @Prop({
        type: PlayerLocation,
    })
    location?: PlayerLocation;

    @Prop({
        type: String,
        enum: PlayerGender
    })
    gender?: PlayerGender;

    @Prop({
        type: String,
        required: true,
        enum: Currency,
        index: true,
    })
    activeCurrency: Currency;

    @Prop({
        type: Number,
        required: true,
        default: 0,
        index: true,
    })
    tier: number;

    @Prop({
        type: Number,
        required: true,
        default: 0,
        index: true,
    })
    tierPercent: number;

    @Prop({
        type: Number,
        required: true,
        default: 100,
        index: true,
    })
    percentToNextTier: number;

    @Prop({
        type: Boolean,
        required: true,
        default: false,
    })
    displayInFiat: boolean;

    @Prop({
        type: Boolean,
        required: true,
        default: false,
    })
    hideZeroBalances: boolean;

    @Prop({
        type: PlayerProfileVerification,
    })
    verificationStatus?: PlayerProfileVerification;
}


