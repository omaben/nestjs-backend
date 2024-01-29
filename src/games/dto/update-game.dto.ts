import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsObject, IsOptional, IsString } from "class-validator";
import { GameTag } from "../enum/game-tag.enum";
import { GameType } from "../enum/game-type.enum";

export class UpdateGameDto {
    @IsString()
    @ApiProperty({
        required: true,
    })
    gameId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    mainImage: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        type: [String],
        required: false,
    })
    types: GameType[];

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    isNewGame: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    published: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    isLive: boolean;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        type: [String],
        required: false,
    })
    tags: GameTag[];
}