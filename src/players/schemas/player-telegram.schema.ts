import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class TelegramProfile {
    @Prop({
        type: Boolean,
    })
    isBot?: boolean;

    @Prop({
        type: String,
    })
    firstName?: string;

    @Prop({
        type: String,
    })
    lasrName?: string;

    @Prop({
        type: String,
    })
    username?: string;

    @Prop({
        type: String,
    })
    languageCode?: string;
}

@Schema(options)
export class PlayerTelegram {
    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true,
    })
    id: string;

    @Prop({
        type: TelegramProfile,
    })
    profile?: TelegramProfile;

    @Prop({
        type: Boolean,
        required: true,
        index: true,
    })
    isVerified: boolean;
}
