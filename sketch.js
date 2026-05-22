var player, player1, playerObj;
var plane1, plane2, plane3, plane4, plane5, plane6, plane7, plane8, plane9;
var enemyRedImg, enemyRed2Img, enemyGreenImg, enemyCyanImg, enemyYellowImg, enemyWhite2Img;
var enemyNImg;
var main_Screen, main_ScreenImg;
var plane_Selection, plane_SelectionMenuImg;
var selectPlaneMenu;
var planeNumber;
var backButton, backButtonImg;
var startGame, startGameImg;
var gameState = "menu";
var enemiesGroup, enemiesRedGroup1, enemiesRedGroup2, enemiesGroupN;
var lasersGroup, laser;
var bullet1Img, bullet2Img, bullet3Img;
var explode;
var newAnime, enemy;
var score = 0;
var level = 0;
var frameC = 0;
var fc1, fc2, fc3, fc4; // frame-stamp anchors for state-transition timers
var e1r = 0, e2r = 0;
var e3n1 = 0, e3n2 = 0, e3n3 = 0, e3n4 = 0;
var selectObj, gameObj, enemiesObj, laserObj, backObj, scoreObj, levelObj;
var laserSound;


function preload(){
    plane1 = loadImage("images/plane/Plane_1.PNG.png");
    plane2 = loadImage("images/plane/Plane_2.PNG.png");
    plane3 = loadImage("images/plane/Plane_9.PNG.png");
    plane4 = loadImage("images/plane/Plane_6.PNG.png");
    plane5 = loadImage("images/plane/Plane_5.PNG.png");
    plane6 = loadImage("images/plane/Plane_3.PNG.png");
    plane7 = loadImage("images/plane/Plane_7.PNG.png");
    plane8 = loadImage("images/plane/Plane_8.PNG.png");
    plane9 = loadImage("images/plane/Plane_4.PNG.png");

    enemyRedImg    = loadImage("images/enemyPlane/Enemy_Plane_Red.png");
    enemyRed2Img   = loadImage("images/enemyPlane/Enemy_Plane_Red-2.png");
    enemyGreenImg  = loadImage("images/enemyPlane/Enemy_Plane_Green.png");
    enemyCyanImg   = loadImage("images/enemyPlane/Enemy_Plane_Cyan.png");
    enemyYellowImg = loadImage("images/enemyPlane/Enemy_Plane_Yellow.png");
    enemyWhite2Img = loadImage("images/enemyPlane/Enemy_Plane_White2.png");
    enemyNImg      = loadImage("images/enemynew-removebg-preview.png");

    main_ScreenImg         = loadImage("images/Untitled.png");
    plane_SelectionMenuImg = loadImage("images/planeSelection.jpg");
    backButtonImg          = loadImage("images/backButton.png");
    startGameImg           = loadImage("images/circle.png");

    bullet1Img = loadImage("images/bullets/fx_shot_04.png");
    bullet2Img = loadImage("images/bullets/fx_shotNEW_x2.png");
    bullet3Img = loadImage("images/bullets/fx_shotNEW_x3.png");

    explode  = loadImage("EXPLODE.png");
    newAnime = loadAnimation(
        "Basic/Hero-FighterJet/Without-Bullet/hero1.png",
        "Basic/Hero-FighterJet/Without-Bullet/hero2.png",
        "Basic/Hero-FighterJet/Without-Bullet/hero3.png",
        "Basic/Hero-FighterJet/Without-Bullet/hero4.png",
        "Basic/Hero-FighterJet/Without-Bullet/hero5.png",
        "Basic/Hero-FighterJet/Without-Bullet/hero6.png"
    );

    laserSound = loadSound("sounds/laserShoot.mp3");
}

function setup(){
    createCanvas(500, displayHeight);
    angleMode(DEGREES);

    selectPlaneMenu = createSprite(250, displayHeight/2);
    selectPlaneMenu.visible = false;

    main_Screen = createSprite(240, displayHeight - 150);
    main_Screen.addImage("main Menu", main_ScreenImg);
    main_Screen.scale = 0.5;

    plane_Selection = createSprite(68, displayHeight - 66, 40, 40);
    plane_Selection.addImage(startGameImg);
    plane_Selection.scale = 0.12;
    plane_Selection.visible = false;

    enemiesGroup     = new Group();
    enemiesRedGroup1 = new Group();
    enemiesRedGroup2 = new Group();
    enemiesGroupN    = new Group();
    lasersGroup      = new Group();

    playerObj  = new Player();
    selectObj  = new Select_Plane();
    gameObj    = new Game();
    enemiesObj = new Enemies();
    laserObj   = new Laser();
    backObj    = new Back();
    scoreObj   = new Score();
    levelObj   = new Level();

    startGame = createSprite(251, 701);
    startGame.addImage(startGameImg);
    startGame.scale = 0.475;
    startGame.visible = false;

    player = createSprite(250, 570, 50, 50);
    player.visible = false;

    player1 = createSprite(250, 570, 50, 50);
    player1.visible = false;
    player1.addAnimation("animation", newAnime);

    frameRate(60);
}

function draw(){
    background("black");
    frameC += 1;
    gameObj.start();

    if(gameState !== "over"){
        player.x = mouseX;
        player.y = mouseY;
        player1.x = mouseX;
        player1.y = mouseY;
    }

    drawSprites();
    text("Score: " + score, 250, 20);

    if(gameState === "over"){
        drawGameOver();
    }
}

function drawGameOver(){
    push();
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(48);
    text("GAME OVER", width/2, height/2 - 40);
    textSize(20);
    text("Final score: " + score, width/2, height/2 + 10);
    text("Press R to restart", width/2, height/2 + 40);
    pop();
    textAlign(LEFT, BASELINE);
}

function keyPressed(){
    if(gameState === "over" && (key === 'r' || key === 'R')){
        resetGame();
    }
}

function resetGame(){
    score = 0;
    playerObj.healthP = 100;
    player._planeNumber = undefined;
    enemiesGroup.removeSprites();
    enemiesRedGroup1.removeSprites();
    enemiesRedGroup2.removeSprites();
    enemiesGroupN.removeSprites();
    lasersGroup.removeSprites();
    e1r = 0; e2r = 0;
    e3n1 = 0; e3n2 = 0; e3n3 = 0; e3n4 = 0;
    fc3 = frameCount;
    frameC = 0;
    gameState = "play";
}
