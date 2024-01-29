import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetGameDto {
    @IsString()
    @ApiProperty({
        required: true
    })
    gameId: string;
}