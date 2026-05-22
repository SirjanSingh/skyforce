class Player {
    constructor(){
        this.healthP = 100
    }
     
    checkCollision(){
        // Crashing into an enemy is *damage*, not a score event. The old
        // code rewarded ramming with +100/+150 on top of -8 HP, which made
        // sui-rushing strictly optimal early on. Now: HP drops, enemy
        // dies, no points.
        for(var i = 0; i < enemiesRedGroup1.length ; i++){
            if(player.isTouching(enemiesRedGroup1[i])){
                playerObj.health(8);
                enemiesRedGroup1[i].destroy();
            }
        }
        for(var i = 0; i < enemiesRedGroup2.length ; i++){
            if(player.isTouching(enemiesRedGroup2[i])){
                playerObj.health(8);
                enemiesRedGroup2[i].destroy();
            }
        }
        for(var i = 0; i < enemiesGroupN.length ; i++){
            if(player.isTouching(enemiesGroupN[i])){
                playerObj.health(8);
                enemiesGroupN[i].destroy();
            }
        }
        // Enemy lasers do half a ram's damage and just disappear on hit.
        for(var i = 0; i < enemyLasersGroup.length; i++){
            if(player.isTouching(enemyLasersGroup[i])){
                playerObj.health(4);
                enemyLasersGroup[i].remove();
            }
        }
    }
    health(loss){
        this.healthP = this.healthP - loss;
        triggerShake(10, 6); // every hit shakes; bigger hits could pass larger mag

        // Bug fix: previous code read this.health (undefined) and assigned
        // to it, which (a) never tripped the <=0 branch and (b) shadowed
        // the health() method itself with the number 0 — so the second
        // collision threw "playerObj.health is not a function".
        if(this.healthP <= 0){
            this.healthP = 0;
            gameState = "over";
        }
        return this.healthP;
    }
    display(){

    }
}