import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Post('*')
  // test(
  //   @Req() req,
  // ): any {
  //   return {
  //     originalUrl: req.originalUrl,
  //     method: req.method,
  //     headers: req.headers
  //   }
  // }

  @Get('health')
  health(): string {
    return this.appService.health();
  }
}
