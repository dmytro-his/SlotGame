import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SlotGameService } from '../slot-game.service';
import { GameViewModel } from '../game-model/ViewModels/GameViewModel';
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
  constructor(private service: SlotGameService) {

  }

  ngOnInit() {
    var loader = new Loader();
    loader.load(loadCallBack.bind(this));

    function loadCallBack(loader, resources) {
      var gameViewModel = new GameViewModel(this.service);
      
      gameViewModel.Init(() => {
        this.game = new SlotGame(this.pixiContainer, gameViewModel, resources);
      });

    };
  }
  ngOnDestroy(): void {
    this.game.Destroy();
  }
}
