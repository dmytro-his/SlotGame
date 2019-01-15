import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, share } from "rxjs/operators";
import { Observable } from 'rxjs';
import { GameResponseBase } from './game-model/GameResponseBase';
import { GameResponseOK } from './game-model/GameResponseOK';

@Injectable({
  providedIn: 'root'
})
export class SlotGameService {

  private _gameSessionId: string = null;

  get gameSessionId() {
    if (this._gameSessionId == null)
      throw new Error('First init');

    return this._gameSessionId;
  }

  constructor(private http: HttpClient) { }

  Init(): Observable<GameResponseOK> {
    if (this._gameSessionId != null)
      return this.GetCurrentState();

    var response = this.http.get<any>('http://localhost:52886/slotGame/init').pipe(share());
    response.subscribe((data) => this._gameSessionId = data.sessionId);
    return response;
  }

  private GetCurrentState(): Observable<GameResponseOK> {

    const params = new HttpParams().set('sessionId', this._gameSessionId);

    return this.http.get<any>('http://localhost:52886/slotGame/GetCurrentState', { params });
  }

  Spin(bet: number): Observable<GameResponseOK> {

    const params = new HttpParams().set('sessionId', this._gameSessionId)
      .set('bet', bet.toString());

    return this.http.get<any>('http://localhost:52886/slotGame/spin', { params });

  }
}


