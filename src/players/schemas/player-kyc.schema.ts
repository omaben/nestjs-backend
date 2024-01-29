import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { PlayerAddress } from './player-address.schema';
import { PlayerDocuments } from './player-documents.schema';
import { PlayerEmail } from './player-email.schema';
import { PlayerMobile } from './player-mobile.schema';
import { PlayerTelegram } from './player-telegram.schema';


const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerKyc {
    @Prop({
        type: PlayerEmail,
    })
    email: PlayerEmail;

    @Prop({
        type: PlayerMobile,
    })
    mobile: PlayerMobile;

    @Prop({
        type: PlayerTelegram,
    })
    telegram: PlayerTelegram;

    @Prop({
        type: PlayerAddress,
    })
    address?: PlayerAddress;

    @Prop({
        type: PlayerDocuments,
    })
    documents?: PlayerDocuments;
}
