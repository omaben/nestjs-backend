import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSubModule } from 'src/pubSub/pubSub.module';
import { RatesModule } from 'src/rates/rates.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersAdminController } from './users-admin.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule,
        PubSubModule,
        RatesModule
    ],
    controllers: [
        UsersController,
        UsersAdminController
    ],
    providers: [
        UsersService
    ],
    exports: [
        UsersService
    ]
})

export class UsersModule { }