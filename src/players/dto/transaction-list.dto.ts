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
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SortDirection, SortDto } from "src/common/dto/sort.dto";
import { Currency } from "src/common/enum/currency.enum";
import { TransactionService } from "../enum/transactions-service.enum";

class SortTransactionsDto extends SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly refId: SortDirection;

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
    readonly type: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly subtype: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly amount: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly amountInUSD: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly currency: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly service: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly userId: SortDirection;
}

class FindTransactionsDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    uniqueId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    refId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    type: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    subtype: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    amountFrom: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    amountTo: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    amountInUsdFrom: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    amountInUsdTo: number;

    @IsOptional()
    @IsEnum(Currency)
    @ApiProperty({
        required: false,
        enum: Currency
    })
    currency: Currency;

    @IsOptional()
    @IsEnum(TransactionService)
    @ApiProperty({
        required: false,
        enum: TransactionService
    })
    service: TransactionService;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    userId: string;
}

export class TransactionListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindTransactionsDto)
    @ApiProperty({
        required: false
    })
    find: FindTransactionsDto;

    @ValidateNested()
    @Type(() => SortTransactionsDto)
    @ApiProperty({
        required: false
    })
    sort: SortTransactionsDto;
}