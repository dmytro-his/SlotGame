import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { HttpClientModule } from '@angular/common/http';
import { GameDashboardComponent } from './game-dashboard/game-dashboard.component';
import { AnimationJsonService } from './animation-json.service';
import { MatButtonModule, MatCheckboxModule, MatMenu, MatMenuModule, MatIconModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SlotGameService } from './slot-game.service';

@NgModule({
  declarations: [
    AppComponent,
    SlotGameComponent,
    GameDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [], // why . .. 
  bootstrap: [AppComponent]
})
export class AppModule { }
