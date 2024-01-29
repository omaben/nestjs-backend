import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Min } from "class-validator";

export class SetGameOrderDto {
    @IsString()
    @ApiProperty({
        required: true,
    })
    gameId: string;

    @IsNumber()
    @Min(1)
    @ApiProperty({
        required: true,
        minimum: 1
    })
    order: number;
}