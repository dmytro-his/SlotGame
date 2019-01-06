import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlotGameComponent } from './slot-game/slot-game.component';

const routes: Routes =[
  { path: '', component: SlotGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
