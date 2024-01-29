import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsAlphanumeric, IsArray, MaxLength, MinLength } from "class-validator";

export class CreateWebSiteOperatorDto {
    @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        example: 'operator-123',
    })
    readonly name: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ApiProperty({
        example: ['https://example.com'],
    })
    readonly domains: string[];
}