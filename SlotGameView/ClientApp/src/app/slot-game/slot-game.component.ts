import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class SlotGameComponent implements OnInit, OnDestroy {

  @ViewChild('pixiContainer') pixiContainer;

  private game: SlotGame;
  constructor(private service: SlotGameService, private animateService: AnimationJsonService) {

  }

  ngOnInit() {
    var loader = new Loader();
    loader.load(loadCallBack.bind(this));

    function loadCallBack() {
      var gameViewModel = new GameViewModel(this.service);
      gameViewModel.Init(() => {
        this.game = new SlotGame(this.pixiContainer, gameViewModel, this.animateService);
      });

    };
  }
  ngOnDestroy(): void {
    this.game.Destroy();
  }
}
