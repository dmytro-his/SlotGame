import { Component, OnInit, ViewChild } from '@angular/core';
import { SlotGameService } from '../slot-game.service';
// import { Guid } from "guid-typescript";
import { GameResponseOK } from '../game-model/GameResponseOK';
import { Cash } from '../game-model/Cash';
import { GameViewModel } from '../game-model/ViewModels/GameViewModel';
import { Currency } from '../game-model/Currency';

/// <reference path="node_modules/pixi-particles/ambient.d.ts" />
require('pixi-particles');



declare var PIXI: any;
declare var require: any



@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.css'],
  providers: [SlotGameService]
})
export class SlotGameComponent implements OnInit {

  private gameViewModel: GameViewModel;

  @ViewChild('pixiContainer') pixiContainer;

  /**
   *
   */
  constructor(private service: SlotGameService) {
    
    this.gameViewModel = new GameViewModel(service);
  }
  ngOnInit() {

    var MARGIN_TOP = 50;
    var LEFT_SHIFT = 0;
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
      .add("assets/buttons/rock.png", "assets/buttons/rock.png")
      .add("assets/buttons/plusButton.png", "assets/buttons/plusButton.png")
      .add("assets/buttons/minusButton.png", "assets/buttons/minusButton.png")

      .add("backGroungImage0", "assets/bg/backImages/background0.jpg")
      .add("backGroungImage1", "assets/bg/backImages/background1.jpg")
      .add("backGroungImage2", "assets/bg/backImages/background2.jpg")
      .add("backGroungImage3", "assets/bg/backImages/background3.png")
      .add("backGroungImage4", "assets/bg/backImages/background4.jpg")
      .add("backGroungImage5", "assets/bg/backImages/background5.jpg")
      .add("backGroungImage6", "assets/bg/backImages/background6.jpg")

      .add("assets/bg/allReelsMask.gif", "assets/bg/allReelsMask.gif")
      .add("assets/bg/blackCells.jpg", "assets/bg/blackCells.jpg")

      .add("assets/bg/centerReelMask.gif", "assets/bg/centerReelMask_2.gif")
      .add("assets/bg/whiteCells.jpg", "assets/bg/whiteCells.jpg")
      .add("assets/bg/snowFlake.png", "assets/bg/snowFlake.png")
      .add("assets/bg/smoke.png", "assets/bg/smoke.png")
      .add("assets/bg/fire.png", "assets/bg/fire.png")
      .add("assets/bg/particle.png", "assets/bg/particle.png")
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


      var bgImages = [
        PIXI.Texture.fromFrame('backGroungImage0'),
        PIXI.Texture.fromFrame('backGroungImage1'),
        PIXI.Texture.fromFrame('backGroungImage2'),
        PIXI.Texture.fromFrame('backGroungImage3'),
        PIXI.Texture.fromFrame('backGroungImage4'),
        PIXI.Texture.fromFrame('backGroungImage5'),
        PIXI.Texture.fromFrame('backGroungImage6')
      ];
      var backStage = PIXI.Sprite.fromImage('');
      backStage.texture = bgImages[0];

      app.stage.addChild(backStage);


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
            symbol = new PIXI.Sprite(slotTextures[this.gameViewModel.gameField[j - 1][i]])
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

      allReelMask.y = MARGIN_TOP;
      centerReelMask.y = MARGIN_TOP;

      allReelMask.x = -LEFT_SHIFT;
      centerReelMask.x = -LEFT_SHIFT;

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
      reelContainer.y = 2 * MARGIN_TOP;
      reelContainer.x = Math.round(app.screen.width - reelContainer.width) / 2 - LEFT_SHIFT;

      var betSettingsContainer = new PIXI.Container();
      var betInfo = PIXI.Sprite.fromImage('assets/buttons/rock.png');
      betInfo.scale.x = 1.5;


      var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        stroke: '#4a1850',
        align: 'center '
      });
      var betText = new PIXI.Text(`Bet:\n${this.gameViewModel.bet.count}`, style);
      betText.x = 35;
      betText.y = 30;
      betInfo.addChild(betText);
      betInfo.interactive = true;
      betInfo.on('pointerdown', () => {
        var index = bgImages.indexOf(backStage.texture) + 1 == bgImages.length ? 0 : bgImages.indexOf(backStage.texture) + 1;
        backStage.texture = bgImages[index];
      })
        .on('pointerover', () => betInfo.alpha = 0.8)
        .on('pointerout', () => betInfo.alpha = 1);


      betSettingsContainer.addChild(betInfo);
      betSettingsContainer.x = 300;
      betSettingsContainer.y = app.screen.height - 100;

      this.gameViewModel.bet.onChangeEvent.subscribe(() => betText.text = `Bet:\n${this.gameViewModel.bet.count}`);

      var plusBetButton = PIXI.Sprite.fromImage('assets/buttons/plusButton.png');
      plusBetButton.width = 50;
      plusBetButton.height = 50;
      plusBetButton.x = 150; //center x
      plusBetButton.y = plusBetButton.height / 2; // center by bottom y
      // plusBetButton.defaultCursor  = 'pointer';
      plusBetButton.interactive = true;
      plusBetButton.on('pointerdown', () => {
        this.gameViewModel.bet.count += 20;
      })
        .on('pointerover', () => plusBetButton.alpha = 0.6)
        .on('pointerout', () => plusBetButton.alpha = 1);


      var minusBetButton = PIXI.Sprite.fromImage('assets/buttons/minusButton.png');
      minusBetButton.width = 50;
      minusBetButton.height = 50;
      // plusBetButton.defaultCursor  = 'pointer';
      minusBetButton.x = -50; //center x
      minusBetButton.y = minusBetButton.height / 2; // center by bottom y
      minusBetButton.interactive = true;
      minusBetButton.on('pointerdown', () => {
        this.gameViewModel.bet.count -= 20;
      })
        .on('pointerover', () => minusBetButton.alpha = 0.6)
        .on('pointerout', () => minusBetButton.alpha = 1);


      betSettingsContainer.addChild(minusBetButton);
      betSettingsContainer.addChild(plusBetButton);


      app.stage.addChild(betSettingsContainer);

      var spinButton = PIXI.Sprite.fromImage('assets/buttons/spinButton.png');
      spinButton.width = 200;
      spinButton.height = 100;
      // spinButton.cursor = 'hover';
      spinButton.x = Math.round((app.screen.width - spinButton.width) / 2) - LEFT_SHIFT; //center x
      spinButton.y = app.screen.height - (margin + spinButton.height) / 2; // center by bottom y
      spinButton.interactive = true;

      spinButton.on('pointerdown', () => {
       if (running) return;

        running = true;
        console.log(this.gameViewModel);
        this.gameViewModel.Spin();
      })
        .on('pointerover', () => spinButton.alpha = 0.6)
        .on('pointerout', () => spinButton.alpha = 1);

      app.stage.addChild(spinButton);



      var cashInfo = PIXI.Sprite.fromImage('assets/buttons/rock.png');
      cashInfo.scale.x = 1.5;
      cashInfo.x = app.screen.width / 2 + 200;
      cashInfo.y = app.screen.height - (margin + cashInfo.height) / 2;

      var cashText = new PIXI.Text(`Cash:\n${this.gameViewModel.cash.count}`, style);
      cashText.x = 35;
      cashText.y = 30;
      cashInfo.addChild(cashText);
      cashInfo.interactive = true;
      cashInfo.on('pointerover', () => cashText.text = Currency[this.gameViewModel.cash.currency].toString())
        .on('pointerout', () => cashText.text = `Cash:\n${this.gameViewModel.cash.count}`);

      app.stage.addChild(cashInfo);

      this.gameViewModel.cash.onChangeEvent.subscribe(() => cashText.text = `Cash:\n${this.gameViewModel.cash.count}`);
      var frontStage = PIXI.Sprite.fromImage('');
      app.stage.addChild(frontStage);
      // Create a new emitter
      // addEmmiterOn(bg);
      var snowFlake = PIXI.Texture.fromImage('assets/bg/snowFlake.png');
      // snowFlake.scale.x
      addEmmiter(backStage, [PIXI.Texture.fromImage('assets/bg/smoke.png')], {
        "alpha": {
          "start": 0.1,
          "end": 0.1
        },
        "scale": {
          "start": 0.15,
          "end": 0.2,
          "minimumScaleMultiplier": 0.5
        },
        "color": {
          "start": "ffffff",
          "end": "ffffff"
        },
        "speed": {
          "start": -100,
          "end": -100
        },
        "startRotation": {
          "min": 50,
          "max": 100
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 10,
          "max": 10
        },
        "blendMode": "normal",
        "ease": [
          {
            "s": 0,
            "cp": 0.379,
            "e": 0.548
          },
          {
            "s": 0.548,
            "cp": 0.717,
            "e": 0.676
          },
          {
            "s": 0.676,
            "cp": 0.635,
            "e": 1
          }
        ],
        "frequency": 0.01,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "pos": {
          "x": 500,
          "y": 50
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
          "x": -500,
          "y": 1000,
          "w": 1800,
          "h": 20
        }
      });

      addEmmiter(backStage, [snowFlake], {
        "alpha": {
          "start": 0.73,
          "end": 0.46
        },
        "scale": {
          "start": 0.05,
          "end": 0.1,
          "minimumScaleMultiplier": 0.1
        },
        "color": {
          "start": "ffffff",
          "end": "ffffff"
        },
        "speed": {
          "start": 30,
          "end": 30
        },
        "startRotation": {
          "min": 50,
          "max": 100
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 20,
          "max": 20
        },
        "blendMode": "normal",
        "ease": [
          {
            "s": 0,
            "cp": 0.379,
            "e": 0.548
          },
          {
            "s": 0.548,
            "cp": 0.717,
            "e": 0.676
          },
          {
            "s": 0.676,
            "cp": 0.635,
            "e": 1
          }
        ],
        "frequency": 0.1,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "pos": {
          "x": 500,
          "y": 50
        },
        "addAtBack": true,
        "spawnType": "rect",
        "spawnRect": {
          "x": -500,
          "y": -100,
          "w": 1800,
          "h": 20
        }
      });


      addEmmiter(frontStage, [snowFlake], {
        "alpha": {
          "start": 0.73,
          "end": 0.46
        },
        "scale": {
          "start": 0.15,
          "end": 0.2,
          "minimumScaleMultiplier": 0.1
        },
        "color": {
          "start": "ffffff",
          "end": "ffffff"
        },
        "speed": {
          "start": 70,
          "end": 70
        },
        "startRotation": {
          "min": 50,
          "max": 100
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 10,
          "max": 10
        },
        "blendMode": "normal",
        "ease": [
          {
            "s": 0,
            "cp": 0.379,
            "e": 0.548
          },
          {
            "s": 0.548,
            "cp": 0.717,
            "e": 0.676
          },
          {
            "s": 0.676,
            "cp": 0.635,
            "e": 1
          }
        ],
        "frequency": 0.1,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "pos": {
          "x": 500,
          "y": 50
        },
        "addAtBack": true,
        "spawnType": "rect",
        "spawnRect": {
          "x": -500,
          "y": -100,
          "w": 1800,
          "h": 20
        }
      });


      addEmmiter(backStage, [PIXI.Texture.fromImage('assets/bg/particle.png'), PIXI.Texture.fromImage('assets/bg/fire.png')],
        {
          "alpha": {
            "start": 0.62,
            "end": 0
          },
          "scale": {
            "start": 0.25,
            "end": 0.75
          },
          "color": {
            //this list is turned into a 5 step gradient inside ParticleExample with
            //PIXI.particles.createSteppedGradient() after the emitter is created
            "list": [
              { "value": "fff191", "time": 0 },
              { "value": "ff622c", "time": 1 }
            ],
            "isStepped": false
          },
          "speed": {
            "start": 50,
            "end": 50
          },
          "startRotation": {
            "min": 265,
            "max": 275
          },
          "rotationSpeed": {
            "min": 50,
            "max": 50
          },
          "lifetime": {
            "min": 0.5,
            "max": 1.3
          },
          "blendMode": "normal",
          "frequency": 0.001,
          "emitterLifetime": 0,
          "maxParticles": 500,
          "pos": {
            "x": 0,
            "y": 0
          },
          "addAtBack": false,
          "spawnType": "rect",
          "spawnRect": {
            "x": 0,
            "y": 750,
            "w": 2000,
            "h": 20
          }
        });


      function addEmmiter(container, sprites, settings) {
        var emitter = new PIXI.particles.Emitter(
          // The PIXI.Container to put the emitter in
          // if using blend modes, it's important to put this
          // on top of a bitmap, and not use the root stage Container
          container,
          // The collection of particle images to use
          sprites,
          // Emitter configuration, edit this to change the look
          // of the emitter
          settings
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var update = function () {

          // Update the next frame
          requestAnimationFrame(update);

          var now = Date.now();

          // The emitter requires the elapsed
          // number of seconds since the last update
          emitter.update((now - elapsed) * 0.001);
          elapsed = now;

          // Should re-render the PIXI Stage
          // renderer.render(stage);
        };

        // Start emitting
        emitter.emit = true;

        // Start the update
        update();
      }

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
