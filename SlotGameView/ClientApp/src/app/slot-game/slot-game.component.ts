import { Component, OnInit, ViewChild } from '@angular/core';
import { SlotGameService } from '../slot-game.service';
// import { Guid } from "guid-typescript";
import { GameResponseOK } from '../game-model/GameResponseOK';
import { Cash } from '../game-model/Cash';
import { GameViewModel } from '../game-model/ViewModels/GameViewModel';
import { WeatherViewModel } from '../game-model/ViewModels/WeatherViewModel';
declare var PIXI: any;


@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.css'],
  providers: [SlotGameService]
})
export class SlotGameComponent implements OnInit {

  private gameViewModel: GameViewModel;
  private weatherViewModel:WeatherViewModel;

  @ViewChild('pixiContainer') pixiContainer;

  /**
   *
   */
  constructor(private service: SlotGameService) {

    this.gameViewModel = new GameViewModel(service);
  }
  ngOnInit() {

    var MARGIN_TOP = 50;
    var ROW_COUNT = 3;

    // create a new Sprite from an image path
    var app = new PIXI.Application(1280, 720, { backgroundColor: 0x1099bb });

    PIXI.loader
      .add("assets/signs/SymH.png", "assets/signs/SymH.png")
      .add("assets/signs/SymA.png", "assets/signs/SymA.png")
      .add("assets/signs/SymP.png", "assets/signs/SymP.png")
      .add("assets/signs/SymY.png", "assets/signs/SymY.png")
      .add("assets/signs/Face1.png", "assets/signs/Face1.png")
      .add("assets/signs/Face2.png", "assets/signs/Face2.png")
      .add("assets/signs/HappyVip.png", "assets/signs/HappyVip.png")

      .add("assets/buttons/spinButton.png", "assets/buttons/spinButton.png")
      .add("assets/buttons/plusButton.png", "assets/buttons/plusButton.png")

      .add("assets/bg/background.jpg", "assets/bg/background.jpeg")

      .add("assets/bg/allReelsMask.gif", "assets/bg/allReelsMask.gif")
      .add("assets/bg/blackCells.jpg", "assets/bg/blackCells.jpg")

      .add("assets/bg/centerReelMask.gif", "assets/bg/centerReelMask_2.gif")
      .add("assets/bg/whiteCells.jpg", "assets/bg/whiteCells.jpg")
      .load(onAssetsLoaded.bind(this));

    var REEL_WIDTH = 170;
    var SYMBOL_SIZE = 165;
    var slotTextures: any[];
    var reels = [];
    var running = false;
    var tweening = [];

    // this.gameViewModel.onInitEvent.subscribe(updateGameField);
    this.gameViewModel.onSpinEvent.subscribe(updateGameField.bind(this));

    function updateGameField() {
      for (var i = 0; i < reels.length; i++) {
        var lengreel = reels[i].symbols.length;
        var position = reels[i].position % lengreel - 1 < 0 ? lengreel - 1 : reels[i].position % lengreel - 1;

        var currentGenerateIndex = 0;
        var countToGenerate = 13 + 5 * i;

        for (var currentGenerateIndex = 0; currentGenerateIndex < countToGenerate; currentGenerateIndex++) {
          var s = reels[i].symbols[position - currentGenerateIndex];

          if (currentGenerateIndex < countToGenerate - 4 || currentGenerateIndex == countToGenerate - 1)
            s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          else
            s.texture = slotTextures[this.gameViewModel.gameField[countToGenerate - currentGenerateIndex - 2][i]];

          s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }


      reels.forEach((r, i, array) => {
        tweenTo(r, "position", r.position + 13 + i * 5, 2500 + i * 600, backout(0.6), null, i == reels.length - 1 ? reelsComplete : null);
      });

      function reelsComplete() {
        tweening = [];
        running = false;
      }

    }
    //onAssetsLoaded handler builds the example.
    function onAssetsLoaded() {

      //Create different slot symbols.
      slotTextures = [
        PIXI.Texture.fromImage("assets/signs/SymH.png"),
        PIXI.Texture.fromImage("assets/signs/SymA.png"),
        PIXI.Texture.fromImage("assets/signs/SymP.png"),
        PIXI.Texture.fromImage("assets/signs/SymY.png"),
        PIXI.Texture.fromImage("assets/signs/Face1.png"),
        PIXI.Texture.fromImage("assets/signs/Face2.png"),
        PIXI.Texture.fromImage("assets/signs/HappyVip.png")
      ];

      var bg = PIXI.Sprite.fromImage('assets/bg/background.jpg');
      app.stage.addChild(bg);

      //Build the reels
      var reelContainer = new PIXI.Container();

      for (var i = 0; i < 5; i++) {
        var rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);
        var reel = {
          container: rc,
          symbols: [],
          position: 0,
          previousPosition: 0,
          blur: new PIXI.filters.BlurFilter()
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        //Build the symbols
        for (var j = 0; j < 2 * (13 + i * 5); j++) {
          var symbol;

          if (j > 0 && j < 4)
            symbol = new PIXI.Sprite(slotTextures[this.gameViewModel.gameField[j-1][i]])
          else
            symbol = new PIXI.Sprite(slotTextures[6]);

          // console.log(symbol);
          //Scale the symbol to fit symbol area.
          symbol.y = j * SYMBOL_SIZE - SYMBOL_SIZE;
          symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
          reel.symbols.push(symbol);
          rc.addChild(symbol);
        }

        reels.push(reel);
      }

      var allReelMask = PIXI.Sprite.fromImage('assets/bg/allReelsMask.gif');
      var blackCells = PIXI.Sprite.fromImage('assets/bg/blackCells.jpg');


      var centerReelMask = PIXI.Sprite.fromImage('assets/bg/centerReelMask.gif');
      var whiteCells = PIXI.Sprite.fromImage('assets/bg/whiteCells.jpg');

      blackCells.alpha = 0.5;
      blackCells.mask = allReelMask;

      whiteCells.alpha = 0.3;
      whiteCells.mask = centerReelMask;

      reelContainer.mask = allReelMask;

      app.stage.addChild(allReelMask, blackCells);
      app.stage.addChild(centerReelMask, whiteCells);
      app.stage.addChild(reelContainer, allReelMask);

      //Build top & bottom covers and position reelContainer
      var margin = (app.screen.height - SYMBOL_SIZE * ROW_COUNT) / 2;
      reelContainer.y = MARGIN_TOP;
      reelContainer.x = Math.round(app.screen.width - reelContainer.width) / 2;


      var spinButton = PIXI.Sprite.fromImage('assets/buttons/spinButton.png');
      spinButton.width = 200;
      spinButton.height = 100;
      // spinButton.cursor = 'hover';
      spinButton.x = Math.round((app.screen.width - spinButton.width) / 2); //center x
      spinButton.y = app.screen.height - (margin + spinButton.height) / 2; // center by bottom y
      spinButton.interactive = true;

      spinButton.on('pointerdown', () => {
        if (running) return;
        
        running = true;
        console.log(this.gameViewModel);
        this.gameViewModel.Spin();
      })
        .on('pointerover', () => spinButton.alpha = 0.3)
        .on('pointerout', () => spinButton.alpha = 1);


      var plusBetButton = PIXI.Sprite.fromImage('assets/buttons/plusButton.png');
      plusBetButton.width = 50;
      plusBetButton.height = 50;
      // plusBetButton.defaultCursor  = 'pointer';
      plusBetButton.x = 300; //center x
      plusBetButton.y = app.screen.height - (margin + plusBetButton.height) / 2; // center by bottom y
      plusBetButton.interactive = true;
      plusBetButton.on('pointerdown', () => { })
        .on('pointerover', () => plusBetButton.alpha = 0.3)
        .on('pointerout', () => plusBetButton.alpha = 1);


      var minusBetButton = PIXI.Sprite.fromImage('assets/buttons/minusButton.png');
      minusBetButton.width = 50;
      minusBetButton.height = 50;
      // plusBetButton.defaultCursor  = 'pointer';
      minusBetButton.x = 500; //center x
      minusBetButton.y = app.screen.height - (margin + minusBetButton.height) / 2; // center by bottom y
      minusBetButton.interactive = true;
      minusBetButton.on('pointerdown', () => { })
        .on('pointerover', () => plusBetButton.alpha = 0.3)
        .on('pointerout', () => plusBetButton.alpha = 1);


      app.stage.addChild(minusBetButton);
      app.stage.addChild(plusBetButton);
      app.stage.addChild(spinButton);

    }
    //Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.

    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
      var tween = {
        object: object,
        property: property,
        propertyBeginValue: object[property],
        target: target,
        easing: easing,
        time: time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
      };

      tweening.push(tween);
    }

    //#region  animation functions 
    app.ticker.add(function () {

      var now = Date.now();
      tweening.forEach((t, i) => {
        var phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        // if (t.change) t.change(t);

        if (phase == 1) {
          t.object[t.property] = t.target;
          if (t.complete)
            t.complete(t);
        }
      });
    });

    app.ticker.add(() => {

      reels.forEach((r, i) => {

        r.blur.blurY = (r.position - r.previousPosition) * 10;
        r.previousPosition = r.position;

        r.symbols.forEach((s, j) => {
          s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
        });
      });
    });

    //Basic lerp funtion.
    function lerp(a1: number, a2: number, t: number) {
      return a1 * (1 - t) + a2 * t;
    }

    function backout(amount: number) {
      return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
    };
    //#endregion

    this.pixiContainer.nativeElement.appendChild(app.view); // this places our pixi application onto the viewable document

  }

}
