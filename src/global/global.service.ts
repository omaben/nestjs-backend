import { CurrencyRates } from "src/rates/interfaces/currency-rates.interface";
import { UserSummary } from "src/users/interfaces/user-summary.interface";

export class GlobalService {
    // TODO : This is not correct, any change on user model case than the user add to this list
    // UI should send or emit activity of a user
    static onlineUsers: {
        [ket: string]: UserSummary
    } = {};

    static rates: CurrencyRates = {
        rate: {
            USDT: undefined,
            BTC: undefined,
            ETH: undefined,
            TRX: undefined,
            DOGE: undefined,
            USD: undefined,
            EUR: undefined,
            JPY: undefined,
            GBP: undefined,
            RUB: undefined,
        },
        updatedAt: undefined
    };

}