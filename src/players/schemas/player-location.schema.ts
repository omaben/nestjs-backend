import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerLocation {
    @Prop({
        type: String,
    })
    country: string;

    @Prop({
        type: String,
    })
    countryCode: string;

    @Prop({
        type: String,
    })
    ip: string;
}
