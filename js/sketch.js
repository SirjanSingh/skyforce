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
var enemiesFighterGroup;
var lasersGroup, laser;
var enemyLasersGroup;
var fighterAnim;
var enemyBulletImg;
var eF = 0; // fighter spawn cap (parallels e1r/e2r/e3n*)
var bullet1Img, bullet2Img, bullet3Img;
var explode;
var explosionAnim;
var spaceBgImg;
var bgScrollY = 0;
var shakeFrames = 0;
var shakeMag = 0;
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
    plane1 = loadImage("assets/sprites/planes/Plane_1.PNG.png");
    plane2 = loadImage("assets/sprites/planes/Plane_2.PNG.png");
    plane3 = loadImage("assets/sprites/planes/Plane_9.PNG.png");
    plane4 = loadImage("assets/sprites/planes/Plane_6.PNG.png");
    plane5 = loadImage("assets/sprites/planes/Plane_5.PNG.png");
    plane6 = loadImage("assets/sprites/planes/Plane_3.PNG.png");
    plane7 = loadImage("assets/sprites/planes/Plane_7.PNG.png");
    plane8 = loadImage("assets/sprites/planes/Plane_8.PNG.png");
    plane9 = loadImage("assets/sprites/planes/Plane_4.PNG.png");

    enemyRedImg    = loadImage("assets/sprites/enemies/Enemy_Plane_Red.png");
    enemyRed2Img   = loadImage("assets/sprites/enemies/Enemy_Plane_Red-2.png");
    enemyGreenImg  = loadImage("assets/sprites/enemies/Enemy_Plane_Green.png");
    enemyCyanImg   = loadImage("assets/sprites/enemies/Enemy_Plane_Cyan.png");
    enemyYellowImg = loadImage("assets/sprites/enemies/Enemy_Plane_Yellow.png");
    enemyWhite2Img = loadImage("assets/sprites/enemies/Enemy_Plane_White2.png");
    enemyNImg      = loadImage("assets/sprites/enemies/enemy_n.png");

    main_ScreenImg         = loadImage("assets/sprites/ui/main_screen.png");
    plane_SelectionMenuImg = loadImage("assets/sprites/ui/plane_selection.jpg");
    backButtonImg          = loadImage("assets/sprites/ui/back_button.png");
    startGameImg           = loadImage("assets/sprites/ui/start_circle.png");

    bullet1Img = loadImage("assets/sprites/bullets/fx_shot_04.png");
    bullet2Img = loadImage("assets/sprites/bullets/fx_shotNEW_x2.png");
    bullet3Img = loadImage("assets/sprites/bullets/fx_shotNEW_x3.png");

    explode  = loadImage("assets/sprites/explode.png");
    spaceBgImg = loadImage("assets/sprites/bg/space.jpg");
    enemyBulletImg = loadImage("assets/sprites/bullets/EnemyBulletPrysznic_L5.png");
    fighterAnim = loadAnimation(
        "assets/anim/fighter/Enemy-Fighter-Get0001.png",
        "assets/anim/fighter/Enemy-Fighter-Get0002.png",
        "assets/anim/fighter/Enemy-Fighter-Get0003.png",
        "assets/anim/fighter/Enemy-Fighter-Get0004.png",
        "assets/anim/fighter/Enemy-Fighter-Get0005.png",
        "assets/anim/fighter/Enemy-Fighter-Get0006.png",
        "assets/anim/fighter/Enemy-Fighter-Get0007.png",
        "assets/anim/fighter/Enemy-Fighter-Get0008.png"
    );
    explosionAnim = loadAnimation(
        "assets/anim/explosionA/1.png",  "assets/anim/explosionA/2.png",
        "assets/anim/explosionA/3.png",  "assets/anim/explosionA/4.png",
        "assets/anim/explosionA/5.png",  "assets/anim/explosionA/6.png",
        "assets/anim/explosionA/7.png",  "assets/anim/explosionA/8.png",
        "assets/anim/explosionA/9.png",  "assets/anim/explosionA/10.png",
        "assets/anim/explosionA/11.png", "assets/anim/explosionA/12.png",
        "assets/anim/explosionA/13.png", "assets/anim/explosionA/14.png",
        "assets/anim/explosionA/15.png", "assets/anim/explosionA/16.png",
        "assets/anim/explosionA/17.png"
    );
    newAnime = loadAnimation(
        "assets/anim/hero/hero1.png",
        "assets/anim/hero/hero2.png",
        "assets/anim/hero/hero3.png",
        "assets/anim/hero/hero4.png",
        "assets/anim/hero/hero5.png",
        "assets/anim/hero/hero6.png"
    );

    laserSound = loadSound("assets/sounds/laser.mp3");
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

    enemiesGroup        = new Group();
    enemiesRedGroup1    = new Group();
    enemiesRedGroup2    = new Group();
    enemiesGroupN       = new Group();
    enemiesFighterGroup = new Group();
    lasersGroup         = new Group();
    enemyLasersGroup    = new Group();

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

    // Scrolling space background only while actually flying (menu /
    // plane-select keep the painted main_Screen sprite art).
    if(gameState === "play" || gameState === "over"){
        drawScrollingBg();
    }

    // Screen shake applies to everything *after* this push so the HUD
    // text and game-over overlay shake with the sprites.
    push();
    if(shakeFrames > 0){
        translate(random(-shakeMag, shakeMag), random(-shakeMag, shakeMag));
        shakeFrames--;
    }

    gameObj.start();

    if(gameState !== "over"){
        player.x = mouseX;
        player.y = mouseY;
        player1.x = mouseX;
        player1.y = mouseY;
    }

    drawSprites();
    drawHud();

    if(gameState === "over"){
        drawGameOver();
    }
    pop();
}

function drawScrollingBg(){
    // Tile the bg image vertically and scroll. imageMode CORNER (default)
    // means (x,y) is the top-left of the image.
    var iw = spaceBgImg.width;
    var ih = spaceBgImg.height;
    var scale = width / iw;
    var drawW = width;
    var drawH = ih * scale;
    bgScrollY = (bgScrollY + 1.5) % drawH;
    var y = bgScrollY - drawH;
    while(y < height){
        image(spaceBgImg, 0, y, drawW, drawH);
        y += drawH;
    }
}

function drawHud(){
    if(gameState !== "play" && gameState !== "over") return;
    fill("white");
    noStroke();
    textSize(18);
    textAlign(LEFT, BASELINE);
    text("HP: " + playerObj.healthP, 14, 24);
    textAlign(CENTER, BASELINE);
    text("Score: " + score, width/2, 24);
    textAlign(RIGHT, BASELINE);
    textSize(12);
    text("FPS: " + Math.round(frameRate()), width - 14, 24);
    textAlign(LEFT, BASELINE);
}

// Called whenever the player gets hit, so the damage carries weight.
// dur = frames, mag = pixels of jitter per axis.
function triggerShake(dur, mag){
    if(dur > shakeFrames) shakeFrames = dur;
    if(mag > shakeMag)    shakeMag = mag;
    // mag decays automatically once shakeFrames hits 0 -- reset there too.
    if(shakeFrames === 0) shakeMag = 0;
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
    enemiesFighterGroup.removeSprites();
    lasersGroup.removeSprites();
    enemyLasersGroup.removeSprites();
    e1r = 0; e2r = 0;
    e3n1 = 0; e3n2 = 0; e3n3 = 0; e3n4 = 0;
    eF = 0;
    fc3 = frameCount;
    frameC = 0;
    gameState = "play";
}
