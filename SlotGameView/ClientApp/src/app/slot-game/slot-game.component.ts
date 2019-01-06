import { Component, OnInit, ViewChild } from '@angular/core';
import { SlotGameService } from '../slot-game.service';
import { Guid } from "guid-typescript";
import { BetLevel } from '../game-model/BetLevelEnum';
import { GameResponseOK } from '../game-model/GameResponseOK';
declare var PIXI: any;


@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.css'],
  providers: [SlotGameService]
})
export class SlotGameComponent implements OnInit {

  @ViewChild('pixiContainer') pixiContainer;

  /**
   *
   */
  constructor(private service: SlotGameService) {

  }
  ngOnInit() {

    var service = this.service;
    // create a new Sprite from an image path
    var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

    PIXI.delta = 60;
    app.delta = 60;
    document.body.appendChild(app.view);

    PIXI.loader
      .add("assets/signs/SymH.png", "assets/signs/SymH.png")
      .add("assets/signs/SymA.png", "assets/signs/SymA.png")
      .add("assets/signs/SymP.png", "assets/signs/SymP.png")
      .add("assets/signs/SymY.png", "assets/signs/SymY.png")
      .add("assets/signs/Face1.png", "assets/signs/Face1.png")
      .add("assets/signs/Face2.png", "assets/signs/Face2.png")
      .add("assets/signs/HappyVip.png", "assets/signs/HappyVip.png")
      .load(onAssetsLoaded);

    var REEL_WIDTH = 160;
    var SYMBOL_SIZE = 150;
    var slotTextures;
    var reels = [];
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

      //Build the reels
      var reelContainer = new PIXI.Container();
      service.Init().subscribe(serverData => {

        console.log('initData');
        console.log(serverData);

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
            if (j > 0 && j < 4) {
              symbol = new PIXI.Sprite(slotTextures[i]);
            }
            else
              symbol = new PIXI.Sprite(slotTextures[6]);

            //Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE - SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);

          }

          reels.push(reel);
        }
        app.stage.addChild(reelContainer);
        
      //Build top & bottom covers and position reelContainer
      var margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
      reelContainer.y = margin;
      reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
      var top = new PIXI.Graphics();
      top.beginFill(0, 1);
      top.drawRect(0, 0, app.screen.width, margin);
      var bottom = new PIXI.Graphics();
      bottom.beginFill(0xffffff);
      bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);
      //Add play text
      var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440
      });

      var playText = new PIXI.Text('Spin!', style);
      playText.x = Math.round((bottom.width - playText.width) / 2);
      playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
      bottom.addChild(playText);

      //Add header text
      var headerText = new PIXI.Text('Happy Slots!', style);
      headerText.x = Math.round((top.width - headerText.width) / 2);
      headerText.y = Math.round((margin - headerText.height) / 2);
      top.addChild(headerText);
      app.stage.addChild(top);
      app.stage.addChild(bottom);

      //Set the interactivity.
      bottom.interactive = true;
      bottom.buttonMode = true;
      var that = this;
      console.log(that);
      bottom.addListener("pointerdown", function () {
        startPlay();
      });

      var running = false;

      //Function to start playing.
      var startPlay = function () {

        if (running) return;

        running = true;
        var sessionId = Guid.parse('8182a03f-58e7-45a3-96f6-50d5809f9c6c');
        var betLevel: BetLevel = BetLevel.x10;

        service.Spin(sessionId, betLevel).subscribe(serverData => {
          console.log(serverData.gameField);

          //generated random its hard work for brain. 
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
                s.texture = slotTextures[serverData.gameField[countToGenerate - currentGenerateIndex - 2][i]];

              s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
              s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
          }

          reels.forEach((r, i, array) => {
            tweenTo(r, "position", r.position + 13 + i * 5, 2500 + i * 600, backout(0.6), null, i == reels.length - 1 ? reelsComplete : null);
          });
        });

      }

      //Reels done handler.
      function reelsComplete() {
        // console.log(reels.map(r => r.position));
        tweening = [];
        running = false;
      }
      });

    }
    //Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
    var tweening = [];
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
      return tween;
    }

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

    this.pixiContainer.nativeElement.appendChild(app.view); // this places our pixi application onto the viewable document

  }

}
