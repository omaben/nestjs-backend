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

class SortGameGroupsDto extends SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly groupId: SortDirection;

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
}

class FindGameGroupsDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    groupId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    title: string;
}

export class GameGroupListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindGameGroupsDto)
    @ApiProperty({
        required: false
    })
    find: FindGameGroupsDto;

    @ValidateNested()
    @Type(() => SortGameGroupsDto)
    @ApiProperty({
        required: false
    })
    sort: SortGameGroupsDto;
}