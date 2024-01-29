import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

import {
    IsEmail,
    IsNotEmpty,
    MaxLength,
    MinLength
} from "class-validator";

export class RequestPasswordRecoveryLinkDto {
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsEmail()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({ example: 'example@email.com' })
    readonly email: string;
}