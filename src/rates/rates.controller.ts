import { Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GlobalService } from "src/global/global.service";
import { RatesService } from "./rates.service";

@ApiTags('rates')
@Controller('rates')
export class RatesController {
    constructor(
        private usersService: RatesService
    ) { }

    @Get('')
    @ApiOperation({
        summary: 'Current rates',
        description:
            'Get current crypto rates.'
    })
    async rates(
        @Res() res,
    ) {
        return res.send(GlobalService.rates);
    }
}