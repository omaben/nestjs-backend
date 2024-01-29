import { ApiProperty } from "@nestjs/swagger";

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class SetAdminPasswordDto {
    @IsString()
    @MinLength(6)
    @MaxLength(8)
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    readonly userId: string;

    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({ example: 'Ab@#123456' })
    readonly password: string;
}