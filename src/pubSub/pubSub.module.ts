import { Module } from '@nestjs/common';
import { PubSubService } from './pubSub.service';

@Module({
  imports: [
  ],
  controllers: [],
  providers: [
    PubSubService,
  ],
  exports: [
    PubSubService
  ],
})
export class PubSubModule { }