import { Cash } from '../Cash';
import { SpinResult } from '../SpinResult';
import { SignName } from '../SignName';
import { LiteEvent } from '../Infrastructure/LiteEvent';
import { StatusResponse } from '../StatusResponse';
import { Currency } from '../Currency';
import { SlotGameService } from 'src/app/slot-game.service';
import { GameResponseOK } from '../GameResponseOK';
import { Observable } from 'rxjs';


export class GameViewModel {

    private sessionId: string;
    public gameField: SignName[][];
    public cash: Cash;
    private _bet: Cash;
    public get bet() {
        return this._bet;
    }
    public set bet(newBet: Cash) {

        if (newBet.count < 100 || newBet.count > 1000)
            return;
        this._bet = newBet;
        this.onBetChangedEvent.raise();
    }
    public onBetChangedEvent: LiteEvent<void> = new LiteEvent<void>();
    public lastSpinResult: SpinResult;


    public onSpinEvent: LiteEvent<void>;

    constructor(private service: SlotGameService) {

        this.lastSpinResult = new SpinResult();
        this._bet = new Cash();
        this._bet.count = 100;
        this._bet.currency = Currency.USD;

        this.gameField = [];
        for (var i = 0; i < 3; i++) {
            this.gameField[i] = [];
            for (var j = 0; j < 5; j++) {
                this.gameField[i][j] = SignName.HappyVip;
            }
        }
        this.onSpinEvent = new LiteEvent<void>();
    }

    public Init(callback): void {

        var response = this.service.Init();

        response.subscribe(serverData => {

            if (serverData.statusResponse != StatusResponse.OK)
                return;
            this.sessionId = serverData.sessionId;

            this.gameField = serverData.gameField;
            this.cash = new Cash();
            this.cash.count = serverData.cash.count;
            this.cash.currency = serverData.cash.currency;

            this.lastSpinResult.bet = serverData.bet;
            this.lastSpinResult.gameField = serverData.gameField;
            this.lastSpinResult.multiplier = serverData.multiplier;
            this.lastSpinResult.profit = serverData.profit;
            this.lastSpinResult.signsWinStatus = serverData.signsWinStatus;
            callback();
        });

    }

    public Spin(): void {

        this.service.Spin(this._bet.count).subscribe(serverData => {

            if (serverData.statusResponse != StatusResponse.OK)
                return;

            this.gameField = serverData.gameField;

            this._bet.count = serverData.bet.count;
            this._bet.currency = serverData.bet.currency;
            this.cash.count = serverData.cash.count;
            this.cash.currency = serverData.cash.currency;

            this.lastSpinResult.bet = serverData.bet;
            this.lastSpinResult.gameField = serverData.gameField;
            this.lastSpinResult.multiplier = serverData.multiplier;
            this.lastSpinResult.profit = serverData.profit;
            this.lastSpinResult.signsWinStatus = serverData.signsWinStatus;
            this.onSpinEvent.raise();
        });
    }


}