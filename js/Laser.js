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
        var ex = createSprite(x, y, 50, 50);
        ex.addImage(explode);
        ex.scale = 0.3;
        ex.lifetime = 5;
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
                score += (enemySprite.points || 100);
                enemySprite.remove();
            }
        });
    }

    display(){

    }
}
