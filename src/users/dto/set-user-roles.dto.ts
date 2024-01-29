import { ApiProperty } from "@nestjs/swagger";
import {
    ArrayMaxSize,
    IsArray,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { Role } from "src/auth/enum/role.enum";

export class SetUserRolesDto {
    @IsString()
    @MinLength(6)
    @MaxLength(8)
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    readonly userId: string;

    @IsArray()
    @ArrayMaxSize(10)
    @ApiProperty({
        type: [Role.OPERATOR],
        enum: Role,
        example: [Role.OPERATOR],
    })
    readonly roles: Role[];
}