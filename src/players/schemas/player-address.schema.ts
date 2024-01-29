import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { PlayerVerificationStatus } from '../enum/player-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerAddress {
    @Prop({
        type: String,
    })
    line1?: string;

    @Prop({
        type: String,
    })
    line2?: string;

    @Prop({
        type: String,
    })
    city?: string;

    @Prop({
        type: String,
    })
    state?: string;

    @Prop({
        type: String,
    })
    country?: string;

    @Prop({
        type: String,
    })
    zip?: string;

    @Prop({
        type: String,
    })
    lat?: string;

    @Prop({
        type: String,
    })
    long?: string;

    @Prop({
        type: String,
        enum: PlayerVerificationStatus,
        index: true,
    })
    verificationStatus?: PlayerVerificationStatus;
}
