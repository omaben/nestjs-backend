import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TModuleRoles } from 'src/auth/types/module-roles.type';
import { Role } from '../../auth/enum/role.enum';
import { UserKyc } from './user-kyc.schema';
import { UserProfile } from './user-profile.schema';
import { UserSecurity } from './user-security.schema';
import { UserUnique } from './user-unique.schema';

export type UserDocument = HydratedDocument<User>;

const options: SchemaOptions = {
    timestamps: true,
};

@Schema(options)
export class User {
    @Prop({
        type: String,
        required: true,
        index: true,
        unique: true
    })
    userId: string;

    @Prop({
        type: UserUnique
    })
    unique: UserUnique;

    @Prop({
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        unique: true
    })
    username: string;

    @Prop({
        type: [String],
        enum: Role
    })
    roles: Role[];

    @Prop({
        type: mongoose.Schema.Types.Mixed
    })
    moduleRoles?: TModuleRoles;

    @Prop({
        type: Boolean,
        required: true,
        index: true,
        default: false
    })
    isDeleted: boolean;

    @Prop({
        type: UserProfile,
        required: true
    })
    profile: UserProfile;

    @Prop({
        type: UserSecurity,
        required: true
    })
    security: UserSecurity;

    @Prop({
        type: UserKyc,
        required: true
    })
    kyc: UserKyc;

    @Prop({
        type: Date,
        index: true
    })
    createdAt?: Date;

    @Prop({
        type: Date,
        index: true
    })
    updatedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };

