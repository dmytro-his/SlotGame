import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationJsonService {
  frontSwowing: string = '/assets/animationSettings/frontSwowing.json';
  backSwowingURL: string = '/assets/animationSettings/backSwowing.json';
  backFireURL: string = '/assets/animationSettings/backFire.json';
  backSmokeURL: string = '/assets/animationSettings/backSmoke.json';


  constructor(private http: HttpClient) {
  }

  public getFrontSnowJSON(): Observable<any> {
    return this.http.get(this.frontSwowing);
  }
  
  public getBackSnowJSON(): Observable<any> {
    return this.http.get(this.backSwowingURL);
  }
  
  public getBackFireJSON(): Observable<any> {
    return this.http.get(this.backFireURL);
  }
  
  public getBackSmokeJSON(): Observable<any> {
    return this.http.get(this.backSmokeURL);
  }
}
