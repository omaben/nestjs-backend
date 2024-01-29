import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
    IsAlphanumeric,
    IsDateString,
    IsEnum,
    IsLowercase,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested
} from "class-validator";

class UserDocumentDto {
    @IsString()    
    @ApiProperty()
    @MaxLength(1024)
    url: string;

    @IsString()    
    @ApiProperty()
    @MaxLength(1024)
    description: string;
}

export class UpdateUserDocumentsDto {
    @ValidateNested()
    @Type(() => UserDocumentDto)
    @ApiProperty({
        required: false
    })
    passport?: UserDocumentDto;

    @ValidateNested()
    @Type(() => UserDocumentDto)
    @ApiProperty({
        required: false
    })
    birthCertificate?: UserDocumentDto;

    @ValidateNested()
    @Type(() => UserDocumentDto)
    @ApiProperty({
        required: false
    })
    personalPhoto?: UserDocumentDto;

    @ValidateNested()
    @Type(() => UserDocumentDto)
    @ApiProperty({
        required: false
    })
    nationalId?: UserDocumentDto;

    @ValidateNested()
    @Type(() => UserDocumentDto)
    @ApiProperty({
        required: false
    })
    utilityBill?: UserDocumentDto;
}