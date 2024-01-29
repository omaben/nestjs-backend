import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DuplicateGameGroupDto {
    @IsString()
    @ApiProperty()
    groupId: string;
}