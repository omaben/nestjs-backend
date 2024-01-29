import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUppercase, ValidateNested } from "class-validator";

export class PlayerDto {
    @IsString()
    @ApiProperty()
    userId: string;

    @IsString()
    @IsUppercase()
    @ApiProperty()
    country: string;

    @IsString()
    @ApiProperty()
    ip: string;

    @IsString()
    @ApiProperty()
    language: string;

    @IsString()
    @IsUppercase()
    @ApiProperty()
    currency: string;
}