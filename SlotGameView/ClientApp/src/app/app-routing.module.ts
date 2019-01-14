import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { GameDashboardComponent } from './game-dashboard/game-dashboard.component';

const routes: Routes =[
  { path: 'DashBoard', component: GameDashboardComponent},
  { path: '', component: SlotGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
