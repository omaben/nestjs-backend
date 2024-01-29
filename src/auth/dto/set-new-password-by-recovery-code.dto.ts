import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class SetNewPasswordByRecoveryCodeDto {
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsEmail()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({ example: 'example@email.com' })
    readonly email: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @MaxLength(1024)
    @IsNotEmpty()
    @ApiProperty({ example: '123456789' })
    readonly code: string;

    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({ example: 'Ab@#123456' })
    readonly password: string;
}