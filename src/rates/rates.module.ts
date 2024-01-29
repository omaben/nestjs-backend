import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 2000,
      maxRedirects: 5,
    })
  ],
  controllers: [
    RatesController
  ],
  providers: [
    RatesService,
  ],
  exports: [
    RatesService
  ],
})
export class RatesModule { }