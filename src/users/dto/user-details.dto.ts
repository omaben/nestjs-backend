import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
    IsString,
} from "class-validator";

export class UserDetailsDto {
    @IsString()
    @ApiProperty()
    userId: string;
}