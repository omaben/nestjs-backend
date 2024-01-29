// export type TCurrency = 'BTC' | 'ETH' | 'DOGE' | 'USDT-TRC' | 'USDT-ERC' | 'TRX';

// export type ICurrency = {
//     [key in TCurrency]: TCurrency;
// }

export enum Currency {
    USD = 'USD',
    USDTTRC = 'USDT-TRC',
    USDTERC = 'USDT-ERC',
    BTC = 'BTC',
    ETH = 'ETH',
    TRX = 'TRX',
} 