import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { PlayerDto } from "./player.dto";

export class GetLaunchUrlDto {
    @ValidateNested()
    @Type(() => PlayerDto)
    @ApiProperty()
    player: PlayerDto;

    @IsString()
    @ApiProperty()
    gameId: string;
}