import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
    _id: false
};

@Schema(options)
export class PlayerWalletDetails {
    @Prop({
        type: String,
        required: true,
        index: true
    })
    address: string;

    @Prop({
        type: Number,
        required: true,
        default: 0,
        index: true
    })
    balance: number;

    @Prop({
        type: Number,
        required: true,
        default: 0,
        index: true
    })
    balanceInUSD: number;
}

@Schema(options)
export class PlayerWalletTotal {
    @Prop({
        type: Number,
        required: true,
        default: 0,
        index: true
    })
    balanceInUSD: number;
}

@Schema(options)
export class PlayerWallet {
    @Prop({
        type: PlayerWalletDetails,
    })
    USDTTRC20?: PlayerWalletDetails;

    @Prop({
        type: PlayerWalletDetails,
    })
    USDTERC20?: PlayerWalletDetails;

    @Prop({
        type: PlayerWalletDetails,
    })
    BTC?: PlayerWalletDetails;

    @Prop({
        type: PlayerWalletDetails,
    })
    ETH?: PlayerWalletDetails;

    @Prop({
        type: PlayerWalletDetails,
    })
    TRX?: PlayerWalletDetails;

    @Prop({
        type: PlayerWalletTotal,
    })
    total?: PlayerWalletTotal;
}
