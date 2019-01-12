import { Cash } from "./Cash";
import { SignName } from './SignName';
import { SignWinStatus } from './SignWinStatus';

export class SpinResult {

    public bet: Cash;
    public multiplier: number;
    public profit: Cash;
    public gameField: SignName[][];
    public signsWinStatus: SignWinStatus[][];

    get isWin(): boolean {
        return this.signsWinStatus.some(w => w.some(v => v == SignWinStatus.Win));
    }

    constructor() {
        this.gameField = [];
        this.signsWinStatus = [];

        for (var i = 0; i < 3; i++) {
            this.gameField[i] = [];
            this.signsWinStatus[i] = [];
            for (var j = 0; j < 5; j++) {
                this.gameField[i][j] = SignName.HappyVip;
                this.signsWinStatus[i][j] = SignWinStatus.NotWin;
            }
        }
    }
}