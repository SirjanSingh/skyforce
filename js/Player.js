class Player {
    constructor(){
        this.healthP = 100;
        this.shieldUntil = 0;  // frameCount past which shield expires
        this.rapidUntil  = 0;  // ditto for rapid-fire
    }

    isShielded(){
        return frameCount < this.shieldUntil;
    }
    hasRapid(){
        return frameCount < this.rapidUntil;
    }
     
    checkCollision(){
        // One pass over enemiesGroup covers every enemy variant (red,
        // fighter, N, diver, gunner, weaver, boss). Was originally three
        // typed loops which had to be extended every time a new enemy
        // type was added.
        //
        // Boss is special: it doesn't die on contact (would defeat the
        // whole HP-bar fight) and the damage is higher because it's a
        // big ship slamming the player.
        for(var i = 0; i < enemiesGroup.length; i++){
            var e = enemiesGroup[i];
            if(player.isTouching(e)){
                if(e._isBoss){
                    playerObj.health(15);
                } else {
                    playerObj.health(8);
                    e.destroy();
                }
            }
        }
        // Enemy lasers now do real damage (was 4) so the fighter waves
        // actually matter for survival.
        for(var i = 0; i < enemyLasersGroup.length; i++){
            if(player.isTouching(enemyLasersGroup[i])){
                playerObj.health(7);
                enemyLasersGroup[i].remove();
            }
        }
    }
    health(loss){
        // Shield absorbs the hit completely (still shake a little so the
        // player gets feedback that something hit them).
        if(this.isShielded()){
            triggerShake(4, 3);
            return this.healthP;
        }
        this.healthP = this.healthP - loss;
        triggerShake(10, 6);
        playHitSfx();

        // Bug fix: previous code read this.health (undefined) and assigned
        // to it, which (a) never tripped the <=0 branch and (b) shadowed
        // the health() method itself with the number 0 — so the second
        // collision threw "playerObj.health is not a function".
        if(this.healthP <= 0){
            this.healthP = 0;
            gameState = "over";
            maybeRecordHighScore();
        }
        return this.healthP;
    }
    display(){

    }
}