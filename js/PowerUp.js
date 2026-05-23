// Three pickup types, each backed by one of the existing 5-7 frame
// animations in assets/anim/ that the original repo bundled but never
// used. Drop chance is rolled in Laser.collision() when an enemy dies.
//
// Effect application is centralized in PowerUp.apply() so the HUD-timer
// reads (playerObj.shieldUntil / playerObj.rapidUntil) and the
// damage / fire-rate gates can be written once and trusted everywhere.

// Sprite scale tuned individually because the 3 source animations were
// drawn at very different native resolutions. Durations & healAmount
// nerfed in the Phase 16 balance pass: the original 6s windows + 25 HP
// heal made the player nearly invincible once any drop arrived.
var POWERUP_TYPES = {
    shield: {
        anim: "shield",
        scale: 0.18,
        durationFrames: 240,     // 4 seconds at 60 fps
    },
    rapid: {
        anim: "speed",
        scale: 0.22,
        durationFrames: 240,
    },
    heal: {
        anim: "coin",
        scale: 0.32,
        durationFrames: 0,       // instant
        healAmount: 18,
    },
};

class PowerUp {
    constructor(){
        // singleton manager; sprites live in powerUpsGroup.
    }

    spawn(x, y, type){
        var cfg = POWERUP_TYPES[type];
        if(!cfg) return;
        var p = createSprite(x, y, 40, 40);
        var anim = (type === "shield") ? shieldAnim
                 : (type === "rapid")  ? speedAnim
                 : coinAnim;
        p.addAnimation("spin", anim);
        p.scale = cfg.scale;
        p.velocityY = 1.6;
        p.setCollider("circle", 0, 0, 18);
        p.lifetime = (height + 80) / p.velocityY;
        p._type = type;
        powerUpsGroup.add(p);
    }

    // Caller decides what to drop. Heal favored when player is hurt.
    rollDrop(x, y, fromBigEnemy){
        var roll = random();
        // Balance: was 0.30 / 0.08 -- too generous, the player stayed
        // permanently buffed once level 2 was in full swing.
        var chance = fromBigEnemy ? 0.14 : 0.04;
        if(roll > chance) return;

        var hurt = playerObj.healthP < 50;
        var pick;
        if(hurt && random() < 0.55) pick = "heal";
        else                        pick = random(["shield", "rapid", "heal"]);
        this.spawn(x, y, pick);
    }

    checkCollision(){
        for(var i = 0; i < powerUpsGroup.length; i++){
            var p = powerUpsGroup.get(i);
            if(player.isTouching(p)){
                this.apply(p._type);
                p.remove();
            }
        }
    }

    apply(type){
        var cfg = POWERUP_TYPES[type];
        if(type === "heal"){
            playerObj.healthP = Math.min(100, playerObj.healthP + cfg.healAmount);
        } else if(type === "shield"){
            playerObj.shieldUntil = frameCount + cfg.durationFrames;
        } else if(type === "rapid"){
            playerObj.rapidUntil = frameCount + cfg.durationFrames;
        }
    }
}
