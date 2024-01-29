import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { RatesService } from 'src/rates/rates.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly usersService: UsersService,
        private readonly ratesService: RatesService
    ) {

    }

    @Interval(1000 * 60)
    async sendOnlineUsersWalletToPriorityList() {
        
    }

    @Interval(1000 * 30)
    async UpdateRates() {
        
    }
}