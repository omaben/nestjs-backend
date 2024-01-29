import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { PlayerVerificationStatus } from '../enum/player-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerProfileVerification {
    @Prop({
        type: String,
        enum: PlayerVerificationStatus,
    })
    firstname?: PlayerVerificationStatus;

    @Prop({
        type: String,
        enum: PlayerVerificationStatus,
    })
    lastname?: PlayerVerificationStatus;

    @Prop({
        type: String,
        enum: PlayerVerificationStatus,
    })
    birthDate?: PlayerVerificationStatus;
}
