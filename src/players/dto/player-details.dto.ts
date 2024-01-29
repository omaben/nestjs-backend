import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
    IsString,
} from "class-validator";

export class PlayerDetailsDto {
    @IsString()
    @ApiProperty()
    userId: string;
}