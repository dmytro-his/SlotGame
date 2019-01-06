import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { GameResponseBase } from './game-model/GameResponseBase';
import { GameResponseOK } from './game-model/GameResponseOK';
import { Guid } from 'guid-typescript';
import { BetLevel } from './game-model/BetLevelEnum';

@Injectable({
  providedIn: 'root'
})
export class SlotGameService {

  constructor(private http: HttpClient) { }

  Init(): Observable<GameResponseOK> {
    return this.http.get<any>('http://localhost:52886');
  }

  Spin(sessionId: Guid, betLevel: BetLevel): Observable<GameResponseOK> {

    const params = new HttpParams().set('sessionId', sessionId.toString())
      .set('betLevel', betLevel.valueOf().toString());
      
    return this.http.get<any>('http://localhost:52886/slotGame/spin', { params });

  }
}

