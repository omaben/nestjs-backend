import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { PlayerVerificationStatus } from '../enum/player-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerDocument {
    @Prop({
        type: String,
    })
    url?: string;

    @Prop({
        type: String,
    })
    description?: string;

    @Prop({
        type: String,
        required: true,
        enum: PlayerVerificationStatus,
    })
    verificationStatus: PlayerVerificationStatus;
}

@Schema(options)
export class PlayerDocuments {
    @Prop({
        type: PlayerDocument,
    })
    passport?: PlayerDocument;

    @Prop({
        type: PlayerDocument,
    })
    birthCertificate?: PlayerDocument;

    @Prop({
        type: PlayerDocument,
    })
    personalPhoto?: PlayerDocument;

    @Prop({
        type: PlayerDocument,
    })
    nationalId?: PlayerDocument;

    @Prop({
        type: PlayerDocument,
    })
    utilityBill?: PlayerDocument;
}
