import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateGameGroupDto {
    @IsString()
    @ApiProperty({
        required: true
    })
    groupId: string;

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