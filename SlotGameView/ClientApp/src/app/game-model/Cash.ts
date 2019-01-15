import { Currency } from './Currency';
import { LiteEvent } from './Infrastructure/LiteEvent';

export class Cash {


    constructor( private _currency: Currency=Currency.USD, private _count: number=0) {

    }
    public get count(): number {
        return this._count;
    }

    public set count(newCount: number) {
        if (newCount < 0)
            return;
        this._count = newCount;
        this.onChangeEvent.raise();
    }

    public get currency(): Currency {
        return this._currency;
    }

    public set currency(newCurrency: Currency) {
        this._currency = newCurrency;
        this.onChangeEvent.raise();
    }
    public onChangeEvent: LiteEvent<void> = new LiteEvent<void>();
}
