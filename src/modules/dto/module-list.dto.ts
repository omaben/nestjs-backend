import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SortDirection, SortDto } from "src/common/dto/sort.dto";

class SortModulesDto extends SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly opId: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly name: SortDirection;
}

class FindModulesDto {
    @IsArray()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    operatorIds: string[];

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    opId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    name: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    domains: string[];
}

export class ModuleListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindModulesDto)
    @ApiProperty({
        required: false
    })
    find: FindModulesDto;

    @ValidateNested()
    @Type(() => SortModulesDto)
    @ApiProperty({
        required: false
    })
    sort: SortModulesDto;
}