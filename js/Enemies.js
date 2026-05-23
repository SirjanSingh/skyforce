class Enemies {
    constructor(){

    }

    createEnemies(x,y,xv,yv){
             enemy = createSprite(x,y,50,50);//created anemy sprite
            //enemy.debug = true;
            var rand = Math.round(random(1,5));// creating a random number 
            //console.log(rand)
            switch(rand){// creating random enemies
                case 1:
                    enemy.addImage(enemyRedImg);
                    enemy.setCollider("circle",0,0,35);//reducing their colliding radius.....as the image was having very large
                    break;
                case 2:
                    enemy.addImage(enemyGreenImg);
                    enemy.setCollider("circle",0,0,35);
                    break;    
                case 3:
                    enemy.addImage(enemyCyanImg);
                    enemy.setCollider("circle",5,0,29);
                    enemy.scale = 1.45
                    break;
                case 4:
                    enemy.addImage(enemyYellowImg);
                    enemy.setCollider("circle",0,0,37);
                    break; 
                case 5:
                    enemy.addImage(enemyWhite2Img);
                    enemy.setCollider("circle",0,0,38);
                    break;
                default :
                    enemy.addImage(enemyRedImg)   
                    enemy.setCollider("circle",0,0,35); 
            }
          
            // Guard against divide-by-zero / negative lifetimes when yv <= 1.
            // Lifetime is "frames to travel one display height at vertical
            // velocity yv", so we need yv > 0 to make any sense.
            var safeYv = Math.max(yv, 1);
            enemy.lifetime = displayHeight / safeYv;
            enemy.points = 100;
            enemy.hp = 1;
            enemiesGroup.add(enemy);//adding the enemies to the Group
    }
    //xv stands for Xvelocity and think further(yv for Yvelocity)
    enemiesRed1(x,y,xv,yv){
        e1r++;//enemy for first round wirh red coluor(e1r ( e--> enemy), ( 1--> first round) , ( r --> red))
        var enemy = createSprite(x,y,50,50);//created sprite
        enemy.addImage(enemyRedImg);//added image for enemy
        enemy.velocityX = xv;// given the velocity
        enemy.velocityY = yv;//given the velocity
        enemy.lifetime  = 500;// giving lifetime
        enemiesGroup.add(enemy);// adding enemies into global group
        enemy.points = 150;
        enemy.hp = 2;   // was 1 (Phase 16 balance)
        enemiesRedGroup1.add(enemy);// adding enemies into  personel group
    }

    enemiesRed2(x,y,xv,yv){//here also every thing same just E1 TO E2
        e2r++;
        var enemy = createSprite(x,y,50,50);
        enemy.addImage(enemyRed2Img);
        enemy.velocityX = xv;
        enemy.velocityY = yv;
        enemy.lifetime  = 500;
        enemiesGroup.add(enemy);
        enemy.points = 150;
        enemy.hp = 2;   // was 1 (Phase 16 balance)
        enemiesRedGroup2.add(enemy);
    }

    enemiesN1(x,y,xv,yv,t){// HERE ALSO SAME
        var enemy = createSprite(x,y,50,50);
        enemy.addImage(enemyNImg);
        enemy.scale = 0.4;
        enemy.velocityX = xv;
        enemy.velocityY = yv ;
        enemy.lifetime  = 800;
        enemy.setCollider("circle",0,-100,100)// TO CIRCLE AS IT WAS NECCASRY
        if(t == 1){//the logic which will make the enemy ship rotate 
            e3n1++;
            enemy.rotation = -22.5
        }
        else if(t == 2){
            e3n2++;
            enemy.rotation = 22.5
        }
        else if(t == 3){// in the below2 conditions rotation property is not changed as last 2 layers of enemy will come in starght line
            e3n3++;
        }
        else if(t == 4){
            e3n4++;
        }
        enemiesGroupN.add(enemy)// adding the enemimes in individual groups

        enemy.points = 200;
        enemy.hp = 4; // bigger formation ships take 4 hits (was 3)
        enemiesGroup.add(enemy); // adding the enemimes in universal groups
    }

    enemiesFighter(x, y, xv, yv){
        // Mid-tier enemy that descends slowly and periodically fires straight
        // down. 8-frame propulsion animation is the visible difference.
        eF++;
        var enemy = createSprite(x, y, 50, 50);
        enemy.addAnimation("fly", fighterAnim);
        enemy.scale = 0.6;
        enemy.velocityX = xv;
        enemy.velocityY = yv;
        enemy.lifetime  = 800;
        enemy.points = 250;
        enemy.hp = 3;   // was 2 (Phase 16 balance)
        enemy.setCollider("circle", 0, 0, 30);
        enemy._lastFire = frameCount + Math.floor(random(20, 60));
        // Fires more often (was 75-110) so it actually threatens.
        enemy._fireEvery = Math.floor(random(55, 85));
        enemiesFighterGroup.add(enemy);
        enemiesGroup.add(enemy);
    }

    // Fast diver: descends in a straight line at high speed. 1 HP, low
    // points (80) -- it's basically a hard-to-hit aerial nuisance.
    enemiesDiver(x){
        eD++;
        var e = createSprite(x, -20, 50, 50);
        e.addImage(enemyGreenImg);
        e.velocityY = 7;
        e.lifetime  = 200;
        e.points = 80;
        e.hp = 1;
        e.setCollider("circle", 0, 0, 28);
        enemiesDiverGroup.add(e);
        enemiesGroup.add(e);
    }

    // Gunner: descends to a stop, fires 3 shots, then retreats. 2 HP,
    // 220 points. Forces the player to make a window vs hovering.
    enemiesGunner(x){
        eG++;
        var e = createSprite(x, -30, 60, 60);
        e.addImage(enemyYellowImg);
        e.velocityY = 2.5;
        e.lifetime  = 800;
        e.points = 220;
        e.hp = 2;
        e.setCollider("circle", 0, 0, 30);
        e._gunnerPhase = "approach";
        e._stopY = 120 + random(-20, 60);
        e._shotsLeft = 3;
        e._lastFire = 0;
        enemiesGunnerGroup.add(e);
        enemiesGroup.add(e);
    }

    updateGunners(){
        for(var i = 0; i < enemiesGunnerGroup.length; i++){
            var g = enemiesGunnerGroup.get(i);
            if(g._gunnerPhase === "approach"){
                if(g.y >= g._stopY){
                    g.velocityY = 0;
                    g._gunnerPhase = "fire";
                    g._lastFire = frameCount;
                }
            } else if(g._gunnerPhase === "fire"){
                if(frameCount - g._lastFire > 28){
                    spawnEnemyLaser(g.x, g.y + 30);
                    g._shotsLeft--;
                    g._lastFire = frameCount;
                    if(g._shotsLeft <= 0){
                        g._gunnerPhase = "leave";
                        g.velocityY = 3.5;
                    }
                }
            }
        }
    }

    // Weaver: cyan, sine-wave horizontal motion as it descends. 2 HP.
    // Adds a moving target challenge without being lethal.
    enemiesWeaver(x){
        eW++;
        var e = createSprite(x, -20, 50, 50);
        e.addImage(enemyCyanImg);
        e.scale = 1.2;
        e.velocityY = 3;
        e.lifetime  = 400;
        e.points = 130;
        e.hp = 2;
        e.setCollider("circle", 0, 0, 28);
        e._weaverBornAt = frameCount;
        enemiesWeaverGroup.add(e);
        enemiesGroup.add(e);
    }

    updateWeavers(){
        for(var i = 0; i < enemiesWeaverGroup.length; i++){
            var w = enemiesWeaverGroup.get(i);
            var t = frameCount - w._weaverBornAt;
            w.velocityX = 3.2 * Math.sin(t * 0.07);
        }
    }

    updateFighters(){
        // Each fighter checks its own cooldown. Firing always shoots straight
        // down; we don't lead the player because the lasers travel fast and
        // the player can dodge laterally.
        for(var i = 0; i < enemiesFighterGroup.length; i++){
            var f = enemiesFighterGroup.get(i);
            if(f.y > 0 && f.y < height - 80 && frameCount - f._lastFire > f._fireEvery){
                spawnEnemyLaser(f.x, f.y + 30);
                f._lastFire = frameCount;
            }
        }
    }

    rotateE12(x,y,q){//to rotate the enemy plane when it comes at a paticular point in 2 frames....in first 
        //it will be straight then it  will turn half then completly and then goo straight
        var e = q; // just did it
        //console.log(e);
        //hope u understand the logic behind it, just think calmly
        if(e === 1){
            for( var i = 0 ; i < enemiesRedGroup1.length;i++){
                var a = 45;
                if(enemiesRedGroup1.get(i).x>140){
                    enemiesRedGroup1.get(i).rotation = a;
                    if(enemiesRedGroup1.get(i).x>150){
                        a+=45;
                        enemiesRedGroup1.get(i).rotation = a;
                        enemiesRedGroup1.get(i).velocityX = x;
                        enemiesRedGroup1.get(i).velocityY = y;
                    }
                }
            }
        }
        else if(e === 2){
            for( var i = 0 ; i < enemiesRedGroup2.length;i++){
                var a = -45;
                if(enemiesRedGroup2.get(i).x<360){
                    enemiesRedGroup2.get(i).rotation = a;
                    if(enemiesRedGroup2.get(i).x<350){
                        a-=45;
                        enemiesRedGroup2.get(i).rotation = a;
                        enemiesRedGroup2.get(i).velocityX = x;
                        enemiesRedGroup2.get(i).velocityY = y;
                    }
                }
            }
        }
    }
    
   

    display(){
        var angle = enemy.angle;
        push();
        translate(enemy.x, enemy.y);
        rotate(angle);
        pop();
    }
}