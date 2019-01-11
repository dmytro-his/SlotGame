import { GameResponseOK } from "../GameResponseOK";
import { ISlotGameService } from '../../ISlotGameService';
import { Cash } from '../Cash';
import { SpinResult } from '../SpinResult';
import { SignName } from '../SignName';
import { LiteEvent } from '../Infrastructure/LiteEvent';
import { StatusResponse } from '../StatusResponse';
import { Currency } from '../Currency';


export class GameViewModel {

    private sessionId: string;
    public gameField: SignName[][];
    public cash: Cash;
    private bet: Cash;
    public lastSpinResult: SpinResult;


    public onSpinEvent: LiteEvent<void>;

    constructor(private service: ISlotGameService) {

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
        this.Init();
    }

    public Init(): void {
        this.service.Init().subscribe(serverData => {

            if (serverData.statusResponse != StatusResponse.OK)
                return;
            this.sessionId = serverData.sessionId;

            this.gameField = serverData.gameField;
            this.cash = new Cash();
            this.cash.count=serverData.cash.count;
            this.cash.currency=serverData.cash.currency;

            this.lastSpinResult.bet = serverData.bet;
            this.lastSpinResult.gameField = serverData.gameField;
            this.lastSpinResult.multiplier = serverData.multiplier;
            this.lastSpinResult.profit = serverData.profit;
            this.lastSpinResult.winSignField = [];
        });
    }

    public Spin(): void {

        this.service.Spin(this.sessionId, this.bet.count).subscribe(serverData => {

            if (serverData.statusResponse != StatusResponse.OK)
                return;

            this.gameField = serverData.gameField;
            this.cash.count=serverData.cash.count;
            this.cash.currency=serverData.cash.currency;

            this.lastSpinResult.bet = serverData.bet;
            this.lastSpinResult.gameField = serverData.gameField;
            this.lastSpinResult.multiplier = serverData.multiplier;
            this.lastSpinResult.profit = serverData.profit;
            this.lastSpinResult.winSignField = [];//
            this.onSpinEvent.raise();
        });
    }


}