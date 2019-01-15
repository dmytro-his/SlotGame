import { forEach } from '@angular/router/src/utils/collection';

declare var PIXI: any;

export class Loader {
    private _assetLoader: any;
    constructor() {
        this._assetLoader = PIXI.loader;
        var resources: { [id: string]: string; } = {}
        resources['assets/signs/SymH.png'] = 'assets/signs/SymH.png';
        resources['assets/signs/SymA.png'] = 'assets/signs/SymA.png';
        resources['assets/signs/SymP.png'] = 'assets/signs/SymP.png';
        resources['assets/signs/SymY.png'] = 'assets/signs/SymY.png';
        resources['assets/signs/Face1.png'] = 'assets/signs/Face1.png';
        resources['assets/signs/Face2.png'] = 'assets/signs/Face2.png';
        resources['assets/signs/HappyVip.png'] = 'assets/signs/HappyVip.png';

        resources['assets/buttons/spinButton.png'] = 'assets/buttons/spinButton.png';
        resources['assets/buttons/rock.png'] = 'assets/buttons/rock.png';
        resources['assets/buttons/plusButton.png'] = 'assets/buttons/plusButton.png';
        resources['assets/buttons/minusButton.png'] = 'assets/buttons/minusButton.png';


        resources['backGroungImage0'] = 'assets/bg/backImages/background0.jpg';
        resources['backGroungImage1'] = 'assets/bg/backImages/background1.jpg';
        resources['backGroungImage2'] = 'assets/bg/backImages/background2.jpg';
        resources['backGroungImage3'] = 'assets/bg/backImages/background3.png';
        resources['backGroungImage4'] = 'assets/bg/backImages/background4.jpg';
        resources['backGroungImage5'] = 'assets/bg/backImages/background5.jpg';
        resources['backGroungImage6'] = 'assets/bg/backImages/background6.jpg';

        resources['assets/bg/allReelsMask.gif'] = 'assets/bg/allReelsMask.gif';
        resources['assets/bg/whiteCells.jpg'] = 'assets/bg/whiteCells.jpg';
        resources['assets/bg/snowFlake.png'] = 'assets/bg/snowFlake.png';
        resources['assets/bg/smoke.png'] = 'assets/bg/smoke.png';
        resources['assets/bg/fire.png'] = 'assets/bg/fire.png';
        resources['assets/bg/particle.png'] = 'assets/bg/particle.png';

        resources['frontSwowingJSON'] = '/assets/animationSettings/frontSwowing.json';
        resources['backSwowingJSON'] = '/assets/animationSettings/backSwowing.json';
        resources['backSmokeJSON'] = '/assets/animationSettings/backSmoke.json';

        for (var key in resources) {
            if (this._assetLoader.resources[key])
                continue;
            this._assetLoader.add(key, resources[key]);
        }
    }
    load(callback) {
        this._assetLoader.load(callback);
    }
}