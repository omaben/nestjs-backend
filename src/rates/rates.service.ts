import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { Currency } from 'src/common/enum/currency.enum';
import { GlobalService } from 'src/global/global.service';
import { Log } from 'src/log/log.helper';

@Injectable()
export class RatesService {
    constructor(
        private readonly httpService: HttpService
    ) {
        setTimeout(() => {
            this.update();
        }, 5000);
    }

    async update() {
        const url = `${process.env.RATE_SERVER_URL}/api/rates`;

        try {
            // Log.success({
            //     type: 'rate',
            //     title: 'update',
            //     message: `update`,
            //     meta: {
            //         originalUrl: url,
            //     }
            // });

            const { data } = await firstValueFrom(
                this.httpService.get<any>(url)
                    .pipe(
                        catchError((err) => {
                            throw err;
                        }),
                    ),
            );

            if (!data.success) {
                Log.error({
                    type: 'rate',
                    title: 'update',
                    message: `Result of rate API`,
                    meta: {
                        originalUrl: url,
                        result: data
                    }
                });

                return;
            }

            Log.debug({
                type: 'rate',
                title: 'update',
                message: `Result of rate API`,
                meta: {
                    originalUrl: url,
                    result: data
                }
            });

            for (const currency1 in GlobalService.rates.rate) {
                if (GlobalService.rates.rate[currency1]) {
                    for (const currency2 in GlobalService.rates.rate[currency1]) {
                        const oldRate = GlobalService.rates.rate[currency1][currency2];
                        const newRate = data.result[currency1][currency2];
                        const diff = Math.abs(oldRate - newRate);
                        const diffPercent = diff / oldRate * 100;

                        if (diffPercent > 5) {
                            Log.warning({
                                type: 'rate',
                                title: 'update',
                                message: `${currency1} | ${currency2} | The new rate is more than ${diffPercent.toFixed(1)}% different from the previous one.`,
                                meta: {
                                    url: url,
                                    oldRate,
                                    newRate,
                                    diff,
                                    diffPercent
                                }
                            });
                        }

                        if (diffPercent < 10) {
                            GlobalService.rates.rate[currency1][currency2] = newRate;
                            GlobalService.rates.updatedAt = new Date();
                        }
                    }
                }
                else {
                    GlobalService.rates.rate[currency1] = data.result[currency1];
                    GlobalService.rates.updatedAt = new Date();
                }
            }
        }
        catch (err) {
            Log.error({
                type: 'rate',
                title: 'update',
                message: `Update rates error`,
                meta: {
                    errorMessage: err.message,
                    stack: err.stack,
                    statusCode: err.response?.data?.statusCode,
                    error: err.response?.data?.error,
                    url: url
                }
            });
        }
    }

    rateInUSD(currency: Currency): number {
        let rate: number = null;

        if (currency === Currency.USDTERC) {
            rate = GlobalService.rates?.rate.USDT.USD;
        }
        else if (currency === Currency.USDTTRC) {
            rate = GlobalService.rates?.rate.USDT.USD;
        }
        else {
            rate = GlobalService.rates?.rate?.[currency]?.USD;
        }

        if (!rate) {
            Log.warning({
                type: 'rate',
                title: 'rateInUSD',
                message: `Currency ${currency} not found`,
                meta: {}
            });
        }

        return rate;
    }

    amountInUSD(amount: number, currency: Currency): number {
        let rate = this.rateInUSD(currency);

        if (!rate) return null;

        return rate * amount;
    }
}