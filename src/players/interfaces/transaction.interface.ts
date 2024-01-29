import { Currency } from "src/common/enum/currency.enum";
import { TransactionService } from "../enum/transactions-service.enum";
import { TransactionSubType } from "../enum/transactions-subtype.enum";
import { TransactionType } from "../enum/transactions-type.enum";

export interface Transaction {
    uniqueId: string;
    refId: string;
    opId: string;
    type: TransactionType;
    subtype: TransactionSubType;
    amount: number;
    amountInUSD: number;
    currency: Currency;
    service: TransactionService;
    userId: string;
    meta?: any;
    createdAt?: Date;
    updatedAt?: Date;
}