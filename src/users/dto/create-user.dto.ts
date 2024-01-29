import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
    IsAlphanumeric,
    IsDateString,
    IsEmail,
    IsLowercase,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateUserDto {
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @MinLength(5)
    @MaxLength(100)
    @IsNotEmpty()
    @IsEmail()
    @IsLowercase()
    @ApiProperty({
        example: 'example@email.com',
        //format: 'email',
    })
    readonly email: string;

    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Ab@#123456'
    })
    readonly password: string;

    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        example: 'amanda',
    })
    readonly username: string;
}