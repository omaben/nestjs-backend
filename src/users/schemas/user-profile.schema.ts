import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Currency } from 'src/common/enum/currency.enum';
import { UserGender } from '../enum/user-gender.enum';
import { UserLocation } from './user-location.schema';
import { UserProfileVerification } from './user-profile-verification.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserProfile {
    @Prop({
        type: String,
        index: true,
    })
    firstname?: string;

    @Prop({
        type: String,
        index: true,
    })
    lastname?: string;

    @Prop({
        type: String,
        index: true,
    })
    nickName?: string;

    @Prop({
        type: String,
        index: true,
    })
    fullname?: string;

    @Prop({
        type: Date,
        index: true,
    })
    birthDate?: Date;

    @Prop({
        type: String,
    })
    avatar?: string;

    @Prop({
        type: UserLocation,
    })
    location?: UserLocation;

    @Prop({
        type: String,
        enum: UserGender
    })
    gender?: UserGender;

    @Prop({
        type: UserProfileVerification,
    })
    verificationStatus?: UserProfileVerification;
}


