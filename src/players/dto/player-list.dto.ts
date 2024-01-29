import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    IsArray,
    IsDateString,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { Role } from "src/auth/enum/role.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SortDirection, SortDto } from "src/common/dto/sort.dto";

class SortPlayersDto extends SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly userId: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly username: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly email: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly lastActivityAt: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly roles: SortDirection;
}

class FindPlayersDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    userId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    username: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    email: string;

    // @IsDateString()
    // @IsOptional()
    // @ApiProperty({
    //     required: false
    // })
    // lastActivityAt: Date;

    @IsOptional()
    @IsEnum(Role)
    @ApiProperty({
        required: false,
        enum: Role
    })
    role: Role;
}

export class PlayerListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindPlayersDto)
    @ApiProperty({
        required: false
    })
    find: FindPlayersDto;

    @ValidateNested()
    @Type(() => SortPlayersDto)
    @ApiProperty({
        required: false
    })
    sort: SortPlayersDto;
}