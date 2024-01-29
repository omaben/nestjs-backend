import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetGameGroupDto {
    @IsString()
    @ApiProperty({
        required: true
    })
    groupId: string;
}