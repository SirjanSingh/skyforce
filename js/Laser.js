class Laser {
    constructor(){
      this.score = 0;
    }

    createLasers(){
      laser = createSprite(mouseX, mouseY - 40, 5, 15);
      laser.scale = 0.8;
      laser.velocityY = -18;
      laser.setCollider("circle", 0, 0, 8);
      laser.lifetime = displayHeight / -laser.velocityY - 2;
      laser.addImage("bullet", bullet1Img);
      laser.depth = player.depth - 2;
      lasersGroup.add(laser);
      laserSound.play();
    }

    spawnExplosion(x, y){
        // 17-frame animation, p5.play advances at frameDelay=4, so the
        // anim takes ~68 game frames end-to-end. We clone the animation
        // so each explosion runs independently, set it non-looping, and
        // let lifetime cull the sprite after the anim has played out.
        var ex = createSprite(x, y, 50, 50);
        ex.addAnimation("boom", explosionAnim);
        ex.animation.looping = false;
        ex.scale = 0.6;
        ex.lifetime = 68;
    }

    collision(){
        // Single source of truth for laser-vs-enemy hits.
        // p5.play's group.overlap fires the callback once per (laser, enemy)
        // pair per frame. Enemies carry .hp (set at spawn — defaults to 1
        // so the existing red/red2/N spawns still die in one shot); a hit
        // always consumes the laser and decrements hp, but only spawns an
        // explosion and awards points when hp drops to 0.
        var self = this;
        lasersGroup.overlap(enemiesGroup, function(laserSprite, enemySprite){
            laserSprite.remove();
            enemySprite.hp = (enemySprite.hp || 1) - 1;
            if(enemySprite.hp <= 0){
                self.spawnExplosion(enemySprite.x, enemySprite.y);
                playBoomSfx();
                // Combo: each kill within 90 frames of the last bumps
                // the multiplier by 0.25, capped at 4.0. comboUntil is
                // the frameCount at which the combo expires.
                if(frameCount < comboUntil){
                    comboCount = Math.min(comboCount + 1, 24);
                } else {
                    comboCount = 1;
                }
                comboUntil = frameCount + 90;
                var mult = 1 + (comboCount - 1) * 0.25;
                if(mult > 4) mult = 4;
                score += Math.floor((enemySprite.points || 100) * mult);
                // Big enemies (N formation / fighters / boss) have a much
                // higher drop rate. Heuristic: points >= 200.
                var big = (enemySprite.points || 0) >= 200;
                powerUpObj.rollDrop(enemySprite.x, enemySprite.y, big);
                if(enemySprite._isBoss){
                    bossObj.defeated = true;
                    triggerShake(40, 14);
                    // Big celebratory blast.
                    self.spawnExplosion(enemySprite.x - 20, enemySprite.y - 20);
                    self.spawnExplosion(enemySprite.x + 20, enemySprite.y + 20);
                }
                enemySprite.remove();
            }
        });
    }

    display(){

    }
}

// Enemy lasers live as their own group; spawn helper kept at module scope
// because the Enemies class is the only caller and we don't need an
// EnemyLaser class to hold what amounts to one constructor + one collider.
function spawnEnemyLaser(x, y){
    var b = createSprite(x, y, 8, 18);
    b.addImage(enemyBulletImg);
    b.scale = 0.5;
    b.velocityY = 8;
    b.setCollider("circle", 0, 0, 6);
    b.lifetime = height / b.velocityY + 4;
    enemyLasersGroup.add(b);
}

