import { GameResponseBase } from "./GameResponseBase";
// import { Guid } from 'guid-typescript';
import { Cash } from './Cash';
import { SignName } from './SignName';
import { StatusResponse } from './StatusResponse';

export class GameResponseOK implements GameResponseBase {
    public sessionId: string;
    public statusResponse: StatusResponse;

    public isWin: boolean;
    public bet: Cash;
    public profit: Cash;
    public cash: Cash;
    public multiplier: number;
    public gameField: SignName[][];
}