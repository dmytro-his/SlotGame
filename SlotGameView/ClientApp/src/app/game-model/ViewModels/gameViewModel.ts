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
    public bet: Cash;
    public lastSpinResult: SpinResult;


    public onSpinEvent: LiteEvent<void>;

    constructor(private service: SlotGameService) {

        this.lastSpinResult = new SpinResult();
        this.bet = new Cash();
        this.bet.count = 100;
        this.bet.currency = Currency.USD;

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

        this.service.Spin(this.bet.count).subscribe(serverData => {

            if (serverData.statusResponse != StatusResponse.OK)
                return;

            this.gameField = serverData.gameField;

            this.bet.count = serverData.bet.count;
            this.bet.currency = serverData.bet.currency;
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