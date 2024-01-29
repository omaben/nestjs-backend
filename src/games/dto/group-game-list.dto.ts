import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
} from "class-validator";
import { GameListDto } from "./game-list.dto";

export class GroupGameListDto extends GameListDto {
    @IsString()
    @ApiProperty({
        example: '1234',
    })
    groupId: string;
}