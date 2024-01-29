interface CurrencyRate {
    USD: number;
    EUR: number;
    JPY: number;
    GBP: number;
    RUB: number;
    USDT: number;
    BTC: number;
    ETH: number;
    TRX: number;
    DOGE: number;
}

export interface CurrencyRates {
    rate: {
        USDT: CurrencyRate;
        BTC: CurrencyRate;
        ETH: CurrencyRate;
        TRX: CurrencyRate;
        DOGE: CurrencyRate;
        USD: CurrencyRate;
        EUR: CurrencyRate;
        JPY: CurrencyRate;
        GBP: CurrencyRate;
        RUB: CurrencyRate;
    };
    updatedAt: Date;
}