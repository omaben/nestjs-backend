import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Min } from "class-validator";

export class ShiftGameOrderDto {
    @IsString()
    @ApiProperty({
        required: true,
    })
    gameId: string;

    @IsNumber()
    @ApiProperty({
        required: true,
    })
    shift: number;
}