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
        enemy.hp = 1;
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
        enemy.hp = 1;
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
        enemy.hp = 3; // bigger formation ships take 3 hits
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
        enemy.hp = 2;
        enemy.setCollider("circle", 0, 0, 30);
        enemy._lastFire = frameCount + Math.floor(random(30, 90));
        enemy._fireEvery = Math.floor(random(75, 110));
        enemiesFighterGroup.add(enemy);
        enemiesGroup.add(enemy);
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