import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class AssignGamesToGroupDto {
    @IsString()
    @ApiProperty({
        required: true,
    })
    groupId: string;

    @IsArray()
    @ApiProperty({
        required: false
    })
    gameIds: string[];
}