import { ApiProperty } from "@nestjs/swagger";
import {
    ArrayMaxSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { Module } from "src/auth/enum/module.enum";
import { Role } from "src/auth/enum/role.enum";

export class SetModuleOperatorRolesDto {
    @IsString()
    @MinLength(6)
    @MaxLength(8)
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    readonly userId: string;

    @IsEnum(Module)
    @ApiProperty({
        enum: Module,
        example: Module.WEBSITE,
    })
    readonly module: Module;

    @IsString()
    @IsOptional()
    @MinLength(4)
    @MaxLength(8)
    @ApiProperty({
        example: '123456',
        required: false
    })
    readonly opId?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'example website',
        required: false
    })
    readonly opName?: string;

    @IsArray()
    @ArrayMaxSize(10)
    @ApiProperty({
        type: [Role.OPERATOR],
        enum: Role,
        example: [Role.OPERATOR],
    })
    readonly roles: Role[];
}