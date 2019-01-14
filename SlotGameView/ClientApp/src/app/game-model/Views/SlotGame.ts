import { GameViewModel } from '../ViewModels/GameViewModel';
import { SignWinStatus } from '../SignWinStatus';
import { Currency } from '../Currency';
import { AnimationJsonService } from '../../animation-json.service';
import { EventEmitter } from 'events';

/// <reference path="../../../node_modules/pixi-particles/ambient.d.ts/>
require('pixi-particles')

declare var PIXI: any;
declare var require: any;

export class SlotGame extends EventEmitter {

    private stage: any;
    private renderer: any;

    constructor(private element: any, private gameViewModel: GameViewModel, private settingsService: AnimationJsonService) {
        super();
        var width = 1280;
        var height = 720;

        // this.stage = new PIXI.Container();
        // // this.renderer = PIXI.autoDetectRenderer(width, height, { element });
        // this.renderer = new PIXI.CanvasRenderer(1280, 720);
        // // this.renderer = new PIXI.WebGLRenderer ( 1280, 720 );

        this.renderer = new PIXI.Application(width, height, null);
        this.stage = this.renderer.stage;

        this.element.nativeElement.appendChild(this.renderer.view); // this places our pixi application onto the viewable document

        var MARGIN_TOP = 50;
        var LEFT_SHIFT = 0;
        var ROW_COUNT = 3;

        var REEL_WIDTH = 170;
        var SYMBOL_SIZE = 165;
        var slotTextures: any[];
        var reels = [];
        var running = false;
        var tweening = [];
        var winSign = [];
        var notWinSign = [];

        var winSignFilter = new PIXI.filters.ColorMatrixFilter();

        var notWinSignFilter = new PIXI.filters.ColorMatrixFilter();

        this.gameViewModel.onSpinEvent.subscribe(updateGameField.bind(this));

        notWinSignFilter.brightness(0.4, true);
        function updateGameField() {
            winSign.forEach(ws => ws.filters = []);
            notWinSign.forEach(nws => nws.filters = []);
            winSign = [];
            notWinSign = [];

            for (var i = 0; i < reels.length; i++) {
                var lengreel = reels[i].symbols.length;
                var position = reels[i].position % lengreel - 1 < 0 ? lengreel - 1 : reels[i].position % lengreel - 1;

                var currentGenerateIndex = 0;
                var countToGenerate = 13 + 5 * i;

                for (var currentGenerateIndex = 0; currentGenerateIndex < countToGenerate; currentGenerateIndex++) {
                    var s = reels[i].symbols[position - currentGenerateIndex];
                    if (currentGenerateIndex < countToGenerate - 4 || currentGenerateIndex == countToGenerate - 1)
                        s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    else {
                        s.texture = slotTextures[this.gameViewModel.gameField[countToGenerate - currentGenerateIndex - 2][i]];
                        if (this.gameViewModel.lastSpinResult.isWin) {
                            if (this.gameViewModel.lastSpinResult.signsWinStatus[countToGenerate - currentGenerateIndex - 2][i] == SignWinStatus.Win) {
                                winSign.push(s);
                                s.filters = [winSignFilter]
                            }
                            else {
                                notWinSign.push(s);
                                s.filters = [notWinSignFilter]
                            }
                        }
                    }

                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);

                    s.beginScale.x = s.scale.x;
                    s.beginScale.y = s.scale.y;
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2) + s.width / 2;
                }
            }


            reels.forEach((r, i, array) => {
                tweenTo(r, "position", r.position + 13 + i * 5, 2500 + i * 600, backout(0.6), null, i == reels.length - 1 ? reelsComplete : null);
            });

            function reelsComplete() {
                tweening = [];
                running = false;
                // this.gameViewModel.cash = 
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

            var bgTextures = [
                PIXI.Texture.fromFrame('backGroungImage0'),
                PIXI.Texture.fromFrame('backGroungImage1'),
                PIXI.Texture.fromFrame('backGroungImage2'),
                PIXI.Texture.fromFrame('backGroungImage3'),
                PIXI.Texture.fromFrame('backGroungImage4'),
                PIXI.Texture.fromFrame('backGroungImage5'),
                PIXI.Texture.fromFrame('backGroungImage6')
            ];
            var backStage = PIXI.Sprite.fromImage('');
            backStage.texture = bgTextures[0];


            this.stage.addChild(backStage);

            //Build the reels
            var reelContainer = new PIXI.Container();

            for (var i = 0; i < 5; i++) {
                var rc = new PIXI.Container();
                rc.x = i * REEL_WIDTH;
                rc.y = SYMBOL_SIZE / 2;
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

                    symbol.anchor.set(0.5, 0.5);
                    symbol.y = j * SYMBOL_SIZE - SYMBOL_SIZE;
                    symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                    symbol.beginScale = {};
                    symbol.beginScale.x = symbol.scale.x;
                    symbol.beginScale.y = symbol.scale.y;
                    symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2) + symbol.width / 2;
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

            this.stage.addChild(allReelMask, blackCells);
            this.stage.addChild(centerReelMask, whiteCells);
            this.stage.addChild(reelContainer, allReelMask);

            //Build top & bottom covers and position reelContainer
            var margin = (this.renderer.screen.height - SYMBOL_SIZE * ROW_COUNT) / 2;
            reelContainer.y = 2 * MARGIN_TOP;
            reelContainer.x = Math.round(width - reelContainer.width) / 2 - LEFT_SHIFT;

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
                var index = bgTextures.indexOf(backStage.texture) + 1 == bgTextures.length ? 0 : bgTextures.indexOf(backStage.texture) + 1;
                backStage.texture = bgTextures[index];
            })
                .on('pointerover', () => betInfo.alpha = 0.8)
                .on('pointerout', () => betInfo.alpha = 1);


            betSettingsContainer.addChild(betInfo);
            betSettingsContainer.x = 300;
            betSettingsContainer.y = this.renderer.screen.height - 100;

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


            this.stage.addChild(betSettingsContainer);

            var spinButton = PIXI.Sprite.fromImage('assets/buttons/spinButton.png');
            spinButton.width = 200;
            spinButton.height = 100;
            // spinButton.cursor = 'hover';
            spinButton.x = Math.round((width - spinButton.width) / 2) - LEFT_SHIFT; //center x
            spinButton.y = height - (margin + spinButton.height) / 2; // center by bottom y
            spinButton.interactive = true;

            spinButton.on('pointerdown', () => {
                if (running) {
                    tweening.forEach(t => t.isHurry = true);
                    return;
                }

                running = true;
                // this.gameViewModel.cash -= this.gameViewModel.bet;//just for animation. but also all doing at server side
                console.log(this.gameViewModel);
                this.gameViewModel.Spin();
            })
                .on('pointerover', () => spinButton.alpha = 0.6)
                .on('pointerout', () => spinButton.alpha = 1);

            this.stage.addChild(spinButton);


            var cashInfo = PIXI.Sprite.fromImage('assets/buttons/rock.png');
            cashInfo.scale.x = 1.5;
            cashInfo.x = width / 2 + 200;
            cashInfo.y = height - (margin + cashInfo.height) / 2;

            console.log(width);
            console.log(height);
            var cashText = new PIXI.Text(`Cash:\n${this.gameViewModel.cash.count}`, style);
            cashText.x = 35;
            cashText.y = 30;
            cashInfo.addChild(cashText);
            cashInfo.interactive = true;
            cashInfo.on('pointerover', () => cashText.text = Currency[this.gameViewModel.cash.currency].toString())
                .on('pointerout', () => cashText.text = `Cash:\n${this.gameViewModel.cash.count}`);

            this.stage.addChild(cashInfo);

            this.gameViewModel.cash.onChangeEvent.subscribe(() => cashText.text = `Cash:\n${this.gameViewModel.cash.count}`);
            // var updateCash = () => cashText.text = `Cash:\n${this.gameViewModel.cash.count}`;

            var frontStage = PIXI.Sprite.fromImage('');
            this.stage.addChild(frontStage);
            // Create a new emitter
            // addEmmiterOn(bg);
            var snowFlake = PIXI.Texture.fromImage('assets/bg/snowFlake.png');

            this.settingsService.getBackSmokeJSON().subscribe((data) => {
                addEmmiter(backStage, [PIXI.Texture.fromImage('assets/bg/smoke.png')], data);
            });
            // snowFlake.scale.x
            this.settingsService.getBackSnowJSON().subscribe((data) => {
                addEmmiter(backStage, [snowFlake], data);
            });
            this.settingsService.getFrontSnowJSON().subscribe((data) => {
                addEmmiter(frontStage, [snowFlake], data);
            });

            this.settingsService.getBackFireJSON().subscribe((data) => {
                addEmmiter(backStage, [PIXI.Texture.fromImage('assets/bg/particle.png'), PIXI.Texture.fromImage('assets/bg/fire.png')], data);
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
                start: Date.now(),
                isHurry: false
            };

            tweening.push(tween);

        }

        // var count = 0;

        // app.ticker.add(() => {

        //     if (winSign.length > 0) {
        //         winSign.forEach(ws => {
        //             ws.scale.x = ws.beginScale.x + Math.cos(count) * 0.05;
        //             ws.scale.y = ws.beginScale.y + Math.cos(count) * 0.05;
        //         });


        //         count += 0.2;

        //         var matrix = winSignFilter.matrix;

        //         // matrix[1] = Math.sin(count) * 3;
        //         matrix[2] = Math.cos(count);
        //         // matrix[3] = Math.cos(count) * 1.5;
        //         // matrix[4] = Math.sin(count / 3) * 2;
        //         // matrix[5] = Math.sin(count / 2);
        //         // matrix[6] = Math.sin(count );
        //     }
        // });

        // var lastChange =0;
        // var lastTween=0;
        function tweenFunc(delta) {

            // this.emit('update', delta-lastTween);
            var now = Date.now();
            tweening.forEach((t, i) => {

                var phase = t.isHurry ? 1 : Math.min(1, (now - t.start) / t.time);

                t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                // if (t.change) t.change(t);

                if (phase == 1) {
                    t.object[t.property] = t.target;
                    if (t.complete)
                        t.complete(t);
                }
            }); 
            // this.renderer.render(this.stage);
            // requestAnimationFrame(tweenFunc.bind(this));
        };
        function changing(delta) {

            // this.emit('update', delta-lastChange);
            reels.forEach((r, i) => {

                r.blur.blurY = (r.position - r.previousPosition) * 10;
                r.previousPosition = r.position;

                r.symbols.forEach((s, j) => {
                    s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
                });
            });
            // this.renderer.render(this.stage);
            // requestAnimationFrame(changing.bind(this));
        }

        this.renderer.ticker.add(changing);
        this.renderer.ticker.add(tweenFunc);
        //Basic lerp funtion.
        function lerp(a1: number, a2: number, t: number) {
            return a1 * (1 - t) + a2 * t;
        }

        function backout(amount: number) {
            return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
        };


        // requestAnimationFrame(tweenFunc.bind(this));
        // requestAnimationFrame(changing.bind(this));

        onAssetsLoaded.call(this);
        // this.renderer.render(this.stage);

    }
}