import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { UserVerificationStatus } from '../enum/user-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserProfileVerification {
    @Prop({
        type: String,
        enum: UserVerificationStatus,
    })
    firstname?: UserVerificationStatus;

    @Prop({
        type: String,
        enum: UserVerificationStatus,
    })
    lastname?: UserVerificationStatus;

    @Prop({
        type: String,
        enum: UserVerificationStatus,
    })
    birthDate?: UserVerificationStatus;
}
