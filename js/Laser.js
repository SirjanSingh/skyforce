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
        // pair per frame, so no double-counting and no parallel-array bookkeeping.
        var self = this;
        lasersGroup.overlap(enemiesGroup, function(laserSprite, enemySprite){
            self.spawnExplosion(enemySprite.x, enemySprite.y);
            score += (enemySprite.points || 100);
            laserSprite.remove();
            enemySprite.remove();
        });
    }

    display(){

    }
}
