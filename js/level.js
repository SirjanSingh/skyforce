class Level {
    constructor(){

    }

    level1(){
         //creating player sprite
        // player = createSprite(250,570,50,50);
        player.visible = true;
        player.scale = 0.5;

        //adding image to the player acc to the choice of user
        main_Screen.visible = false;

        // Bind the chosen plane's animation once per selection. The old
        // code called player.addAnimation() every frame, which appended a
        // new label each tick and ballooned the sprite's animation map.
        // case 2 also wrongly mapped to plane1 — fixed to plane2.
        if(player._planeNumber !== planeNumber){
            var animMap = {
                1: plane1, 2: plane2, 3: plane3, 4: plane4, 5: plane5,
                6: plane6, 7: plane7, 8: plane8, 9: plane9
            };
            player.addAnimation("simple", animMap[planeNumber] || plane1);
            player._planeNumber = planeNumber;
        }
            textSize(20)
            text("FPS:"+Math.round(frameRate()),400,25)
            text("HP:"+playerObj.healthP,20,25)

            playerObj.checkCollision();

            if(frameC % 15 === 0/*the rate of enemy production*/ && frameC > (fc3+75)/* the time after which the enemy will  be produced*/ && e1r < 5/*limiting the number of enemy produced to 5*/){
                enemiesObj.enemiesRed1(0,120,5,0)   // creaing  the enemes set of 5
            }
            if(frameC % 15 === 0 && frameC > (fc3 + 150) && e2r < 5 ){
                enemiesObj.enemiesRed2(500,120,-5,0)
            }
           // the second wave of enemies begin from here...with another animation
            if(frameC % 22 === 0 && frameC > (fc3 + 200) && e3n1 < 8){
                enemiesObj.enemiesN1(60,0,2,4,1);
            }
            if(frameC % 22 === 0 && frameC > (fc3 + 320) && e3n2 < 8){
                enemiesObj.enemiesN1(440,0,-2,4,2);
            }
            if(frameC % 25 === 0 && frameC > (fc3 + 420) && e3n3 < 8){
                enemiesObj.enemiesN1(60,0,0,4,3);
            }
            if(frameC % 25 === 0 && frameC > (fc3 + 500) && e3n4 < 8){
                enemiesObj.enemiesN1(440,0,0,4,4);
            }
            
                
    /*
            if(frameCount % 25 === 0){
                enemiesObj.createEnemies(random(50,450),0,0,5);

            }*/
            //rotated the enemies

            enemiesObj.rotateE12(0,5,1);
            enemiesObj.rotateE12(0,5,2);
            //rate of bullet firing
            if(frameC % 4 === 0){
            laserObj.createLasers();
            }
            
        laserObj.collision();
           //console.log(lasersGroup.length)
        }
    display(){

    }
}