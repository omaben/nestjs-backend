import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RatesModule } from 'src/rates/rates.module';
import { UsersModule } from 'src/users/users.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    RatesModule
  ],
  controllers: [],
  providers: [
    TasksService,
  ],
  exports: [
    TasksService
  ],
})
export class TasksModule { }