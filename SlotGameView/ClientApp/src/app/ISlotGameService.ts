import { Observable } from 'rxjs';
import { GameResponseOK } from './game-model/GameResponseOK';

export interface ISlotGameService {
    Init(): Observable<GameResponseOK>;
    Spin(sessionId: string, bet: number): Observable<GameResponseOK>;
}
