import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SortDirection, SortDto } from "src/common/dto/sort.dto";
import { GameProvider } from "../enum/game-provider.enum";
import { GameType } from "../enum/game-type.enum";

class SortGamesDto extends SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly provider: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly popularity: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly rtpMin: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly rtpMax: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly type: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly stakeMin: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly stakeMax: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly title: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly order: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly isLive: SortDirection;
}

class FindGamesDto {
    @IsOptional()
    @IsEnum(GameProvider)
    @ApiProperty({
        required: false,
        enum: GameProvider
    })
    provider: GameProvider;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    popularity: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    rtpMin: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    rtpMax: number;

    @IsOptional()
    @IsEnum(GameType)
    @ApiProperty({
        required: false,
        enum: GameType
    })
    type: GameType;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    stakeMin: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    stakeMax: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    title: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    published: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    isLive: boolean;
}

export class GameListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindGamesDto)
    @ApiProperty({
        required: false
    })
    find: FindGamesDto;

    @ValidateNested()
    @Type(() => SortGamesDto)
    @ApiProperty({
        required: false
    })
    sort: SortGamesDto;

    @ApiProperty({
        example: 20,
        description: 'Start from 1.'
    })
    limit: number = 20;

    @ApiProperty({
        example: 1,
    })
    page: number = 1;
}