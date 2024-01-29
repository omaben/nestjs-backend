import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { UserVerificationStatus } from '../enum/user-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserAddress {
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
        enum: UserVerificationStatus,
        index: true,
    })
    verificationStatus?: UserVerificationStatus;
}
