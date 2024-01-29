import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
    IsAlphanumeric,
    IsDateString,
    IsEnum,
    IsLowercase,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";
import { Currency } from "src/common/enum/currency.enum";

export class UpdateUserProfileDto {
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        example: 'amanda',
        required: false
    })
    readonly username?: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({
        example: '2000-01-01',
        required: false,
        format: 'date'
    })
    readonly birthDate?: Date;

    @IsEnum(Currency)
    @IsOptional()
    @ApiProperty({
        example: Currency.BTC,
        required: false,
        enum: Currency
    })
    readonly activeCurrency?: Currency;
}