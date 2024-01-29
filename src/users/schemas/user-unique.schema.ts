import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserUnique {
    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true
    })
    id1: string;

    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true
    })
    id2: string;

    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true
    })
    id3: string;
}
