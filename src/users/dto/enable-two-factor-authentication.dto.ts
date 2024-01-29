import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";

export class EnableTwoFactorAuthenticationDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  @ApiProperty({ example: '999999' })
  readonly code: string;
}

