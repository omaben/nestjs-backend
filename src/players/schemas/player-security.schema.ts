import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { PlayerTwoFactorAuthentication } from './player-two-factor-authentication.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerSecurity {
    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
    })
    adminPassword?: string;

    @Prop({
        type: PlayerTwoFactorAuthentication,
        required: true,
    })
    twoFactorAuthentication: PlayerTwoFactorAuthentication;

    @Prop({
        type: String,
    })
    passwordRecoveryCode?: string;

    @Prop({
        type: Date,
    })
    passwordRecoveryExpiredAt?: Date;
}

