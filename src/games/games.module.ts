import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  imports: [
    
  ],
  controllers: [
    GamesController,
  ],
  providers: [
    GamesService,
  ],
  exports: [
    GamesService
  ],
})
export class GamesModule { }