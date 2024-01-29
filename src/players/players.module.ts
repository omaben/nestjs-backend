import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSubModule } from 'src/pubSub/pubSub.module';
import { RatesModule } from 'src/rates/rates.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
    imports: [
        JwtModule,
        PubSubModule,
        RatesModule
    ],
    controllers: [
        PlayersController
    ],
    providers: [
        PlayersService
    ],
    exports: [
        PlayersService
    ]
})

export class PlayersModule { }