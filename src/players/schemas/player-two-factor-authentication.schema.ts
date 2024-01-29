import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerTwoFactorAuthentication {
    @Prop({
        type: Boolean,
        required: true,
    })
    isTimeBasedEnabled: boolean;

    @Prop({
        type: String,
    })
    timeBasedSecret?: string;
}

