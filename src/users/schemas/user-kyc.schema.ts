import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { UserAddress } from './user-address.schema';
import { UserDocuments } from './user-documents.schema';
import { UserEmail } from './user-email.schema';
import { UserMobile } from './user-mobile.schema';
import { UserTelegram } from './user-telegram.schema';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class UserKyc {
    @Prop({
        type: UserEmail,
    })
    email: UserEmail;

    @Prop({
        type: UserMobile,
    })
    mobile: UserMobile;

    @Prop({
        type: UserTelegram,
    })
    telegram: UserTelegram;

    @Prop({
        type: UserAddress,
    })
    address?: UserAddress;

    @Prop({
        type: UserDocuments,
    })
    documents?: UserDocuments;
}
