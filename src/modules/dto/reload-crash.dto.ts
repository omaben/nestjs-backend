import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
    IsObject,
    IsOptional,
} from "class-validator";

export class ReloadCrashDto {
    @IsObject()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    options: any;
}