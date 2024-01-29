import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerEmail {
    @Prop({
        type: String,
        index: true,
        required: true,
        unique: true,
        lowercase: true
    })
    address: string;

    @Prop({
        type: String,
        required: true,
    })
    hash: string;

    @Prop({
        type: Boolean,
        required: true,
        default: false,
        index: true,
    })
    isVerified: boolean;

    @Prop({
        type: String,
        index: true,
    })
    verificationCode?: string;

    @Prop({
        type: Date,
        index: true,
    })
    verificationCodeExpiredAt?: Date;
}
