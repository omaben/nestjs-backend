import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { UserVerificationStatus } from '../enum/user-profile-verification.enum';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserDocument {
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
        enum: UserVerificationStatus,
    })
    verificationStatus: UserVerificationStatus;
}

@Schema(options)
export class UserDocuments {
    @Prop({
        type: UserDocument,
    })
    passport?: UserDocument;

    @Prop({
        type: UserDocument,
    })
    birthCertificate?: UserDocument;

    @Prop({
        type: UserDocument,
    })
    personalPhoto?: UserDocument;

    @Prop({
        type: UserDocument,
    })
    nationalId?: UserDocument;

    @Prop({
        type: UserDocument,
    })
    utilityBill?: UserDocument;
}
