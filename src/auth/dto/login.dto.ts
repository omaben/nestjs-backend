import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class LoginDto {
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsEmail()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({
        example: 'example@email.com'
    })
    readonly email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ab@#123456'
    })
    readonly password: string;

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