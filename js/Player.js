class Player {
    constructor(){
        this.healthP = 100
    }
     
    checkCollision(){
        for(var i = 0; i < enemiesRedGroup1.length ; i++){
            if(player.isTouching(enemiesRedGroup1[i])  ){
                playerObj.health(8);
                enemiesRedGroup1[i].destroy()
                score+=100;
            }
        }
        for(var i = 0; i < enemiesRedGroup2.length ; i++){
            if(player.isTouching(enemiesRedGroup2[i])  ){
                playerObj.health(8);
                enemiesRedGroup2[i].destroy()
                score+=100;
            }
        }
        for(var i = 0; i < enemiesGroupN.length ; i++){
            if(player.isTouching(enemiesGroupN[i])  ){
                playerObj.health(8);
                enemiesGroupN[i].destroy()
                score+=150;
            }
        }


    }
    health(loss){
        this.healthP = this.healthP - loss;
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