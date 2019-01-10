import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { GameResponseBase } from './game-model/GameResponseBase';
import { GameResponseOK } from './game-model/GameResponseOK';
// import { Guid } from 'guid-typescript';
import { ISlotGameService } from './ISlotGameService';

@Injectable({
  providedIn: 'root'
})
export class SlotGameService implements ISlotGameService{

  constructor(private http: HttpClient) { }

  Init(): Observable<GameResponseOK> {
    return this.http.get<any>('http://localhost:52886/slotGame/init');
  }

  Spin(sessionId: string, bet: number): Observable<GameResponseOK> {

    const params = new HttpParams().set('sessionId', sessionId)
      .set('bet', bet.toString());
      
    return this.http.get<any>('http://localhost:52886/slotGame/spin', { params });

  }
}


