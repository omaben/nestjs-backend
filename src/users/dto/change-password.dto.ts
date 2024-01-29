import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class ChangePasswordDto {
    @IsString()
    //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ab@#123456'
    })
    readonly oldPassword: string;

    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ab@#123456'
    })
    readonly newPassword: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(6)
    @ApiProperty({
        example: '999999',
        required: false
    })
    readonly twoFactorAuthenticationCode?: string;
}