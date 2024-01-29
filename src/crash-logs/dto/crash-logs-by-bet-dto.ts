import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CrashLogsByBetDto {
    @IsString()
    @ApiProperty()
    betId: string;

    @IsString()
    @ApiProperty()
    roundMd5: string;

    @IsString()
    @ApiProperty()
    playerId: string;
}