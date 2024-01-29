import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        required: false,
        example: 20,
        description: 'Maximums is 50.'
    })
    @IsPositive()
    @Min(1)
    @Max(50)
    limit: number = 20;

    @ApiProperty({
        required: false,
        example: 1,
        description: 'Start from 1.'
    })
    @IsPositive()
    @Min(1)
    page: number = 1;
}
