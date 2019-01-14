import { Component, OnInit, ViewChild } from '@angular/core';
import { SlotGameService } from '../slot-game.service';
// import { Guid } from "guid-typescript";
import { GameResponseOK } from '../game-model/GameResponseOK';
import { Cash } from '../game-model/Cash';
import { GameViewModel } from '../game-model/ViewModels/GameViewModel';
import { Currency } from '../game-model/Currency';
import { AnimationJsonService } from '../animation-json.service';
import { SignWinStatus } from '../game-model/SignWinStatus';
import { Loader } from '../game-model/Views/Loader';
import { SlotGame } from '../game-model/Views/SlotGame';

@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.css']
})
export class SlotGameComponent implements OnInit {

  @ViewChild('pixiContainer') pixiContainer;
  constructor(private service: SlotGameService, private animateService: AnimationJsonService) {

  }

  ngOnInit() {
    console.log('1');
    var loader = new Loader();
    console.log('2');
    loader.load(loadCallBack.bind(this));

    console.log('3');
    function loadCallBack() {
      console.log('4');
      var gameViewModel = new GameViewModel(this.service);
      console.log('5');
      gameViewModel.Init(() => {
        console.log('6');
        new SlotGame(this.pixiContainer, gameViewModel, this.animateService);

        console.log('7');
      });

      console.log('8');
    };
  }
}
