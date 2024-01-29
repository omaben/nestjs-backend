import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export type SortDirection = 1 | -1;

export enum SortDirectionEnum {
    ASC = 'asc',
    DES = 'des'
}
export class SortDto {
    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly createdAt: SortDirection;

    @IsNumber()
    @IsIn([-1, 1])
    @IsOptional()
    @ApiProperty({
        required: false,
        example: -1
    })
    readonly updatedAt: SortDirection;
}