import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrashLogsController } from './crash-logs.controller';
import { CrashLogsService } from './crash-logs.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    controllers: [
        CrashLogsController
    ],
    providers: [
        CrashLogsService
    ],
    exports: [
        CrashLogsService
    ]
})

export class CrashLogsModule { }