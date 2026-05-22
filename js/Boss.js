// Level-end boss. Uses enemy_n.png scaled up (the only existing sprite
// big enough to read as a leader-class ship without extra art).
//
// Two phases:
//   Phase 1 (HP > 50%): slow horizontal bob at top of screen, single
//                       bullet straight down every 70 frames.
//   Phase 2 (HP <= 50%): faster bob, triple-spread fire every 40 frames.
//
// Level controller spawns the boss when LEVELS[current].boss is true and
// every regular wave is exhausted. Defeat flips bossObj.defeated which
// Level.update reads to fire its complete() -> VICTORY chain.

class Boss {
    constructor(){
        this.sprite = null;
        this.spawned = false;
        this.defeated = false;
        this.maxHp = 100;
    }

    spawn(){
        if(this.spawned) return;
        var b = createSprite(width/2, -80, 120, 120);
        b.addImage(enemyNImg);
        b.scale = 1.6;
        b.velocityY = 1.2;
        b.hp = this.maxHp;
        b.points = 5000;
        b.setCollider("circle", 0, 0, 55);
        b._target = 110;       // park y
        b._dir = 1;
        b._lastFire = frameCount + 60;
        b._isBoss = true;
        enemiesGroup.add(b);
        this.sprite = b;
        this.spawned = true;
        this.defeated = false;
    }

    update(){
        if(!this.spawned || !this.sprite) return;
        var b = this.sprite;
        // p5.play marks .removed once a sprite has been remove()'d; treat
        // that as "boss is dead" (Laser.collision flags defeated, but a
        // defensive read here covers any other code path that removes it).
        if(b.removed){
            this.sprite = null;
            this.spawned = false;
            this.defeated = true;
            return;
        }

        var phase2 = b.hp <= this.maxHp / 2;

        // Movement
        if(b.y < b._target){
            b.velocityY = 1.2;
            b.velocityX = 0;
        } else {
            b.velocityY = 0;
            b.velocityX = (phase2 ? 3.0 : 1.6) * b._dir;
            if(b.x > width - 70) b._dir = -1;
            if(b.x < 70)         b._dir = 1;
        }

        // Fire
        var fireEvery = phase2 ? 40 : 70;
        if(frameCount - b._lastFire > fireEvery && b.y > 20){
            spawnEnemyLaser(b.x, b.y + 60);
            if(phase2){
                spawnEnemyLaser(b.x - 36, b.y + 50);
                spawnEnemyLaser(b.x + 36, b.y + 50);
            }
            b._lastFire = frameCount;
        }
    }

    drawHpBar(){
        if(!this.spawned || !this.sprite) return;
        var b = this.sprite;
        var pct = Math.max(0, b.hp) / this.maxHp;
        push();
        noStroke();
        fill(40);
        rect(40, 46, width - 80, 12);
        if(pct > 0.5)        fill(120, 220, 120);
        else if(pct > 0.25)  fill(220, 220, 80);
        else                 fill(220, 80, 80);
        rect(40, 46, (width - 80) * pct, 12);
        fill("white");
        textAlign(CENTER, BASELINE);
        textSize(11);
        text("BOSS", width/2, 45);
        pop();
        textAlign(LEFT, BASELINE);
    }

    reset(){
        if(this.sprite && !this.sprite.removed) this.sprite.remove();
        this.sprite = null;
        this.spawned = false;
        this.defeated = false;
    }
}
