import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GameDashboardComponent } from './game-dashboard/game-dashboard.component';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule,
  MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatCheckboxModule,
  MatTabsModule, MatExpansionModule, MatSnackBarModule, MatAutocompleteModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';

import { LayoutModule } from '@angular/cdk/layout';
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
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatAutocompleteModule
  ],
  providers: [SlotGameService, HttpClient], // why . .. 
  bootstrap: [AppComponent]
})
export class AppModule { }
