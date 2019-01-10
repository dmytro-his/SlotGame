import { Cash } from "./Cash";
import { SignName } from './SignName';

export class SpinResult {

    public bet: Cash;
    public multiplier: number;
    public profit: Cash;
    public gameField: SignName[][];
    public winSignField: boolean[][];

    get isWin(): boolean {
        return this.winSignField.some(w => w.some(v => v == true));
    }

    constructor() {
        this.gameField = [];
        this.winSignField = [];

        for (var i = 0; i < 3; i++) {
            this.gameField[i] = [];
            this.winSignField[i] = [];
            for (var j = 0; j < 5; j++) {
                this.gameField[i][j] = SignName.HappyVip;
                this.winSignField[i][j] = false;
            }
        }
    }
}