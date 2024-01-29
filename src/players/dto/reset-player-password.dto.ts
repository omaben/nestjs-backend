import { ApiProperty } from "@nestjs/swagger";

import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class ResetPlayerPasswordDto {
    @IsString()
    @MinLength(6)
    @MaxLength(8)
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    readonly userId: string;
}