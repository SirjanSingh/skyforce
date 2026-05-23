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

var powerUpsGroup, powerUpObj;
var shieldAnim, speedAnim, coinAnim;
var bossObj;
var highScore = 0;
var hitOsc, hitEnv, boomOsc, boomEnv;
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
    shieldAnim = loadAnimation(
        "assets/anim/shield/Shield-PowerUps0001.png",
        "assets/anim/shield/Shield-PowerUps0002.png",
        "assets/anim/shield/Shield-PowerUps0003.png",
        "assets/anim/shield/Shield-PowerUps0004.png",
        "assets/anim/shield/Shield-PowerUps0005.png"
    );
    speedAnim = loadAnimation(
        "assets/anim/speed/Speed-Booster0001.png",
        "assets/anim/speed/Speed-Booster0002.png",
        "assets/anim/speed/Speed-Booster0003.png",
        "assets/anim/speed/Speed-Booster0004.png",
        "assets/anim/speed/Speed-Booster0005.png",
        "assets/anim/speed/Speed-Booster0006.png",
        "assets/anim/speed/Speed-Booster0007.png"
    );
    coinAnim = loadAnimation(
        "assets/anim/coin/Star-Coin-Animation0001.png",
        "assets/anim/coin/Star-Coin-Animation0002.png",
        "assets/anim/coin/Star-Coin-Animation0003.png",
        "assets/anim/coin/Star-Coin-Animation0004.png",
        "assets/anim/coin/Star-Coin-Animation0005.png"
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
    powerUpsGroup       = new Group();

    playerObj  = new Player();
    selectObj  = new Select_Plane();
    gameObj    = new Game();
    enemiesObj = new Enemies();
    laserObj   = new Laser();
    backObj    = new Back();
    scoreObj   = new Score();
    levelObj   = new Level();
    powerUpObj = new PowerUp();
    bossObj    = new Boss();

    highScore = loadHighScore();
    setupSfx();

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
    if(gameState === "play" || gameState === "over" || gameState === "victory"){
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

    if(gameState !== "over" && gameState !== "victory"){
        player.x = mouseX;
        player.y = mouseY;
        player1.x = mouseX;
        player1.y = mouseY;
    }

    drawSprites();
    if(gameState === "menu") drawMenuOverlay();
    drawHud();
    if(bossObj)  bossObj.drawHpBar();
    if(levelObj) levelObj.drawBanner();

    if(gameState === "over"){
        drawGameOver();
    } else if(gameState === "victory"){
        drawVictory();
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
    if(gameState !== "play" && gameState !== "over" && gameState !== "victory") return;
    fill("white");
    noStroke();
    textSize(18);
    textAlign(LEFT, BASELINE);
    text("HP: " + playerObj.healthP, 14, 24);
    textAlign(CENTER, BASELINE);
    text("Score: " + score, width/2, 24);
    textAlign(RIGHT, BASELINE);
    textSize(12);
    if(levelObj && levelObj.current){
        text("LVL " + levelObj.current + "  FPS " + Math.round(frameRate()),
             width - 14, 24);
    } else {
        text("FPS: " + Math.round(frameRate()), width - 14, 24);
    }
    textAlign(LEFT, BASELINE);

    // Power-up timers under the HP readout.
    var y = 46;
    if(playerObj.isShielded()){
        var sLeft = Math.ceil((playerObj.shieldUntil - frameCount) / 60);
        fill(120, 200, 255);
        text("SHIELD " + sLeft + "s", 14, y);
        y += 18;
    }
    if(playerObj.hasRapid()){
        var rLeft = Math.ceil((playerObj.rapidUntil - frameCount) / 60);
        fill(255, 220, 100);
        text("RAPID " + rLeft + "s", 14, y);
    }

    // Soft shield ring around the player.
    if(playerObj.isShielded() && gameState === "play"){
        push();
        noFill();
        var pulse = 26 + 3 * sin(frameCount * 6);
        stroke(120, 200, 255, 180);
        strokeWeight(2);
        ellipse(player.x, player.y, pulse * 2, pulse * 2);
        pop();
    }
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
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(44);
    text("GAME OVER", width/2, height/2 - 80);
    textSize(18);
    text("Final score: " + score, width/2, height/2 - 32);
    text("Best: " + highScore, width/2, height/2 - 8);
    drawEndScreenButtons();
    pop();
    textAlign(LEFT, BASELINE);
}

function drawVictory(){
    push();
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);
    fill(255, 220, 120);
    textAlign(CENTER, CENTER);
    textSize(46);
    text("VICTORY!", width/2, height/2 - 80);
    fill("white");
    textSize(18);
    text("Final score: " + score, width/2, height/2 - 32);
    text("Best: " + highScore, width/2, height/2 - 8);
    drawEndScreenButtons();
    pop();
    textAlign(LEFT, BASELINE);
}

function drawEndScreenButtons(){
    // Two stacked text-buttons. Hit boxes are mirrored in mousePressed
    // (height/2 + 42..72 for restart, +78..110 for menu).
    var cx = width / 2;
    var restartY = height/2 + 56;
    var menuY    = height/2 + 94;
    var hoverR = (mouseY > height/2 + 42 && mouseY < height/2 + 72 &&
                  mouseX > cx - 110 && mouseX < cx + 110);
    var hoverM = (mouseY > height/2 + 78 && mouseY < height/2 + 110 &&
                  mouseX > cx - 110 && mouseX < cx + 110);
    textSize(18);
    fill(hoverR ? "white" : 200);
    text("[ R ]  Restart", cx, restartY);
    fill(hoverM ? "white" : 200);
    text("[ M ]  Return to Menu", cx, menuY);
}

function keyPressed(){
    // Pause toggle. Implemented via noLoop()/loop() so p5.play's physics
    // tick stops too -- otherwise sprites would keep drifting under the
    // overlay. We paint the overlay manually before noLoop because once
    // the loop stops, draw() won't run again until loop() resumes.
    if(key === 'p' || key === 'P'){
        if(gameState === "play"){
            gameState = "paused";
            drawPauseOverlay();
            noLoop();
            return;
        } else if(gameState === "paused"){
            gameState = "play";
            loop();
            return;
        }
    }
    if((gameState === "over" || gameState === "victory")){
        if(key === 'r' || key === 'R'){ resetGame(); return; }
        if(key === 'm' || key === 'M'){ returnToMenu(); return; }
    }
}

// Hit-test "Return to Menu" / "Restart" text on game-over/victory overlays.
// Buttons drawn in drawGameOver/drawVictory at fixed coords so the click
// targets are predictable.
function mousePressed(){
    if(gameState !== "over" && gameState !== "victory") return;
    var cx = width / 2;
    // Restart band:  y in [height/2 + 44, height/2 + 70], x within ~120 of center
    // Menu band:     y in [height/2 + 80, height/2 + 104]
    if(mouseY > height/2 + 42 && mouseY < height/2 + 72 &&
       mouseX > cx - 110 && mouseX < cx + 110){
        resetGame();
    } else if(mouseY > height/2 + 78 && mouseY < height/2 + 110 &&
              mouseX > cx - 110 && mouseX < cx + 110){
        returnToMenu();
    }
}

function returnToMenu(){
    // Same cleanup as resetGame but lands on the menu, not in level 1.
    score = 0;
    if(playerObj){
        playerObj.healthP = 100;
        playerObj.shieldUntil = 0;
        playerObj.rapidUntil = 0;
    }
    if(player) player._planeNumber = undefined;
    [enemiesGroup, enemiesRedGroup1, enemiesRedGroup2, enemiesGroupN,
     enemiesFighterGroup, lasersGroup, enemyLasersGroup, powerUpsGroup]
        .forEach(function(g){ if(g) g.removeSprites(); });
    if(bossObj) bossObj.reset();
    if(player)  player.visible = false;
    if(player1) player1.visible = false;
    if(main_Screen) main_Screen.visible = true;
    // startGame / plane_Selection are intentionally invisible hot-spots
    // painted on top of the main_Screen image -- don't toggle them visible.
    if(levelObj){ levelObj.current = 0; levelObj.banner = null; }
    frameC = 0;
    gameState = "menu";
}

function drawMenuOverlay(){
    push();
    fill("white");
    noStroke();
    textAlign(CENTER, BASELINE);
    textSize(14);
    text("High Score: " + highScore, width/2, 22);
    textSize(11);
    text("Mouse to fly  ·  P to pause  ·  R to restart on game over",
         width/2, height - 16);
    pop();
    textAlign(LEFT, BASELINE);
}

function drawPauseOverlay(){
    push();
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(40);
    text("PAUSED", width/2, height/2 - 20);
    textSize(16);
    text("Press P to resume", width/2, height/2 + 30);
    pop();
    textAlign(LEFT, BASELINE);
}

function loadHighScore(){
    try {
        var h = parseInt(localStorage.getItem("skyforce_highScore") || "0", 10);
        return isNaN(h) ? 0 : h;
    } catch(e){ return 0; }
}

function saveHighScore(s){
    try { localStorage.setItem("skyforce_highScore", String(s)); } catch(e){}
}

function maybeRecordHighScore(){
    if(score > highScore){
        highScore = score;
        saveHighScore(highScore);
    }
}

// Synth SFX -- repo only ships laser.mp3 + menu.mp3, and bundling extra
// wavs for one-shot hits is overkill. p5.sound's oscillator + envelope
// gives us readable "hit" (low-freq triangle blip) and "boom" (noise-y
// sawtooth thud) without any new asset files.
function setupSfx(){
    hitOsc = new p5.Oscillator("triangle");
    hitEnv = new p5.Envelope();
    hitEnv.setADSR(0.001, 0.06, 0.0, 0.06);
    hitEnv.setRange(0.25, 0);
    hitOsc.amp(hitEnv);
    hitOsc.freq(140);
    hitOsc.start();

    boomOsc = new p5.Oscillator("sawtooth");
    boomEnv = new p5.Envelope();
    boomEnv.setADSR(0.001, 0.1, 0.0, 0.12);
    boomEnv.setRange(0.3, 0);
    boomOsc.amp(boomEnv);
    boomOsc.freq(70);
    boomOsc.start();
}

function playHitSfx(){
    if(hitEnv) hitEnv.play();
}
function playBoomSfx(){
    if(boomEnv) boomEnv.play();
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
    powerUpsGroup.removeSprites();
    playerObj.shieldUntil = 0;
    playerObj.rapidUntil = 0;
    bossObj.reset();
    fc3 = frameCount;
    frameC = 0;
    gameState = "play";
    levelObj.start(1);
}
