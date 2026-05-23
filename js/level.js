// Multi-level controller.
//
// Each level is one entry in LEVELS keyed by 1..N (index 0 unused so the
// 'current level' integer maps directly). A level is described entirely
// by its waves table: each wave is "starting at localFrame=startFrame,
// spawn one of `type` every `every` frames, cap at `cap` total spawns".
//
// Old level1() hard-coded six if(frameC % X === 0 && frameC > (fc3+Y) &&
// counterZ < N) branches. The new shape collapses to one for-loop and
// lets a future level be added by appending one object to LEVELS.

// 5-level campaign. Boss moved to L5 so the new mid-game levels (3 + 4)
// can introduce diver/gunner/weaver variants without the player ever
// fighting a boss in their first sitting.
var LEVELS = [
    null,
    {
        name: "Asteroid Belt",
        tint: [10, 20, 60],        // dim blue
        waves: [
            { type: "red1",    every: 18, cap: 6, startFrame: 60  },
            { type: "red2",    every: 18, cap: 6, startFrame: 200 },
        ],
        boss: false,
    },
    {
        name: "Heavy Resistance",
        tint: [40, 10, 70],        // dark purple
        waves: [
            { type: "red1",    every: 15, cap: 8, startFrame: 60  },
            { type: "red2",    every: 15, cap: 8, startFrame: 60  },
            { type: "fighter", every: 90, cap: 6, startFrame: 220 },
            { type: "N1",      every: 22, cap: 6, startFrame: 400 },
        ],
        boss: false,
    },
    {
        name: "Diving Squadron",
        tint: [70, 20, 20],        // dark red
        waves: [
            { type: "red1",     every: 14,  cap: 6,  startFrame: 60  },
            { type: "diver",    every: 18,  cap: 12, startFrame: 120 },
            { type: "weaver",   every: 60,  cap: 6,  startFrame: 240 },
            { type: "asteroid", every: 80,  cap: 4,  startFrame: 200 },
            { type: "fighter",  every: 100, cap: 4,  startFrame: 360 },
        ],
        boss: false,
    },
    {
        name: "Crossfire",
        tint: [30, 50, 20],        // dark olive
        waves: [
            { type: "gunner",   every: 110, cap: 6,  startFrame: 60  },
            { type: "weaver",   every: 55,  cap: 8,  startFrame: 180 },
            { type: "asteroid", every: 60,  cap: 6,  startFrame: 220 },
            { type: "diver",    every: 16,  cap: 10, startFrame: 280 },
            { type: "fighter",  every: 80,  cap: 6,  startFrame: 360 },
            { type: "N1",       every: 22,  cap: 4,  startFrame: 480 },
        ],
        boss: false,
    },
    {
        name: "Final Push",
        tint: [60, 10, 10],        // deep red, ominous
        waves: [
            { type: "red1",     every: 12,  cap: 10, startFrame: 60  },
            { type: "red2",     every: 12,  cap: 10, startFrame: 60  },
            { type: "diver",    every: 18,  cap: 8,  startFrame: 120 },
            { type: "asteroid", every: 50,  cap: 8,  startFrame: 180 },
            { type: "fighter",  every: 60,  cap: 8,  startFrame: 240 },
            { type: "gunner",   every: 130, cap: 4,  startFrame: 300 },
            { type: "N1",       every: 20,  cap: 6,  startFrame: 180 },
            { type: "N2",       every: 22,  cap: 6,  startFrame: 380 },
            { type: "N3",       every: 28,  cap: 4,  startFrame: 560 },
            { type: "N4",       every: 28,  cap: 4,  startFrame: 660 },
        ],
        boss: true,
    },
];

class Level {
    constructor(){
        this.current     = 0;
        this.startFrame  = 0;
        this.waves       = null;
        this.banner      = null;
        this._nextStart  = 0;
        this._nextLevel  = 0;
    }

    start(n){
        this.current     = n;
        this.startFrame  = frameCount;
        this._nextStart  = 0;
        this._nextLevel  = 0;
        var def = LEVELS[n];
        // Clone wave defs so per-run `spawned` counters don't bleed across runs.
        this.waves = def.waves.map(function(w){
            return { type: w.type, every: w.every, cap: w.cap,
                     startFrame: w.startFrame, spawned: 0 };
        });
        this.showBanner("Level " + n + ": " + def.name, 120);
        // Legacy spawn-cap globals — unused for gating now, but kept zero
        // so any debug overlay reading them stays sensible.
        e1r = 0; e2r = 0; e3n1 = 0; e3n2 = 0; e3n3 = 0; e3n4 = 0;
        eF = 0; eD = 0; eG = 0; eW = 0;
    }

    showBanner(text, durFrames){
        this.banner = { text: text, until: frameCount + durFrames };
    }

    update(){
        // Pending next-level transition (set by complete()).
        if(this._nextStart && frameCount >= this._nextStart){
            this.start(this._nextLevel);
        }
        if(!this.current) return;

        // Player setup (was the top half of the old level1()).
        player.visible = true;
        player.scale = 0.5;
        main_Screen.visible = false;
        if(player._planeNumber !== planeNumber){
            var animMap = { 1:plane1, 2:plane2, 3:plane3, 4:plane4, 5:plane5,
                            6:plane6, 7:plane7, 8:plane8, 9:plane9 };
            player.addAnimation("simple", animMap[planeNumber] || plane1);
            player._planeNumber = planeNumber;
        }

        playerObj.checkCollision();

        var localFrame = frameCount - this.startFrame;
        for(var i = 0; i < this.waves.length; i++){
            var w = this.waves[i];
            var since = localFrame - w.startFrame;
            if(since >= 0 && since % w.every === 0 && w.spawned < w.cap){
                this._spawnFromWave(w);
                w.spawned++;
            }
        }

        enemiesObj.rotateE12(0, 5, 1);
        enemiesObj.rotateE12(0, 5, 2);
        enemiesObj.updateFighters();
        enemiesObj.updateGunners();
        enemiesObj.updateWeavers();

        var fireEvery = playerObj.hasRapid() ? 2 : 4;
        if(frameC % fireEvery === 0){
            laserObj.createLasers();
        }
        laserObj.collision();
        powerUpObj.checkCollision();

        // Boss spawns once all regular waves are exhausted and the field
        // is clear. Banner gives the player a beat to brace.
        var def = LEVELS[this.current];
        var allSpawned = this.waves.every(function(w){ return w.spawned >= w.cap; });
        if(def.boss && allSpawned && !bossObj.spawned && !bossObj.defeated
           && enemiesGroup.length === 0){
            bossObj.spawn();
            this.showBanner("BOSS INCOMING", 90);
        }
        bossObj.update();

        // Level-complete check.
        if(!this._nextStart){
            var bossDone = !def.boss || bossObj.defeated;
            if(allSpawned && enemiesGroup.length === 0 && bossDone){
                this.complete();
            }
        }
    }

    _spawnFromWave(w){
        switch(w.type){
            case "red1":    enemiesObj.enemiesRed1(0,   120,  5, 0); break;
            case "red2":    enemiesObj.enemiesRed2(500, 120, -5, 0); break;
            case "fighter":
                var sideX = (w.spawned % 2 === 0) ? 90 : 410;
                enemiesObj.enemiesFighter(sideX, -20, 0, 1.5);
                break;
            case "N1":      enemiesObj.enemiesN1(60,  0,  2, 4, 1); break;
            case "N2":      enemiesObj.enemiesN1(440, 0, -2, 4, 2); break;
            case "N3":      enemiesObj.enemiesN1(60,  0,  0, 4, 3); break;
            case "N4":      enemiesObj.enemiesN1(440, 0,  0, 4, 4); break;
            case "diver":
                enemiesObj.enemiesDiver(random(40, width - 40));
                break;
            case "gunner":
                // Spread across thirds so 3+ gunners don't pile up.
                var lanes = [width * 0.25, width * 0.5, width * 0.75];
                enemiesObj.enemiesGunner(lanes[w.spawned % 3]);
                break;
            case "weaver":
                enemiesObj.enemiesWeaver(random(60, width - 60));
                break;
            case "asteroid":
                asteroidObj.spawn(random(40, width - 40));
                break;
        }
    }

    complete(){
        // Save progress *before* advancing so the level select map
        // reflects the just-cleared level even if the player bails.
        if(this.current > maxLevelCompleted){
            maxLevelCompleted = this.current;
            saveMaxLevel(maxLevelCompleted);
        }
        if(this.current >= LEVELS.length - 1){
            gameState = "victory";
            maybeRecordHighScore();
            this.showBanner("VICTORY!", 600);
        } else {
            this.showBanner("Level " + this.current + " complete!", 90);
            this._nextLevel = this.current + 1;
            this._nextStart = frameCount + 90;
        }
    }

    drawBanner(){
        if(!this.banner || frameCount > this.banner.until) return;
        push();
        fill(0, 0, 0, 160);
        noStroke();
        rect(0, height/2 - 50, width, 100);
        fill("white");
        textAlign(CENTER, CENTER);
        textSize(26);
        text(this.banner.text, width/2, height/2);
        pop();
        textAlign(LEFT, BASELINE);
    }

    // Game.play() still calls level1() — alias preserves the old entry point.
    level1(){ this.update(); }

    display(){}
}
