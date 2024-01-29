import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateGameGroupDto {
    @IsString()
    @ApiProperty({
        required: true
    })
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    icon: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    description: string;
}