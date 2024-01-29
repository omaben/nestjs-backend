import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerMobile {
    @Prop({
        type: String,
        required: true,
        index: true,
    })
    countryCode: string;

    @Prop({
        type: String,
        required: true,
        index: true,
    })
    countryNumber: string;

    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true,
    })
    number: string;

    @Prop({
        type: String,
        required: true,
    })
    hash: string;

    @Prop({
        type: Boolean,
        required: true,
        default: false
    })
    isVerified: boolean;

    @Prop({
        type: String,
    })
    verificationCode?: string;

    @Prop({
        type: Date,
    })
    verificationCodeExpiredAt?: Date;
}
