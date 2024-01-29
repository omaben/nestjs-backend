import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { UserTwoFactorAuthentication } from './user-two-factor-authentication.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserSecurity {
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
        type: UserTwoFactorAuthentication,
        required: true,
    })
    twoFactorAuthentication: UserTwoFactorAuthentication;

    @Prop({
        type: String,
    })
    passwordRecoveryCode?: string;

    @Prop({
        type: Date,
    })
    passwordRecoveryExpiredAt?: Date;
}

