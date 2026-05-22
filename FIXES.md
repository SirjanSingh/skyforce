# Sky Force — How to Fix Everything

Each item below is a real issue in the original `FINAL-PROJECT` code, with a
**Before** (what's there now) and **After** (a fix). These are reference fixes —
apply them in the revamp, not in the original repo.

Ordered roughly by impact.

---

## 1. Two competing collision systems → keep one

**Problem.** `Laser.collision()` (array-based, teleports enemies to `x=800`,
needs 2 hits via a global `et`) and `Score.score1()` (group-based, spawns the
explosion + scores, needs 2 touches via `j/k/l`) both run every frame. They
double-count and disagree on what a "kill" is.

**Before** (js/Laser.js — abridged):
```js
collision(){
  for (var i = 0; i < enemies.length; i++) {
    for (var j = 0; j < lasers.length; j++) {
      if (lasers[j].isTouching(enemies[i])) {
        et++;
        lasers[j].destroy();
        if (et == 2) { enemies[i].x = 800; et = 0; }   // teleport, not kill
      }
    }
  }
}
```
…plus js/score.js doing its own touch loop to add score + explosions.

**After.** One method owns laser↔enemy: destroy laser, destroy enemy, spawn
explosion, add score — in the same place. Delete `Score.score1()`'s collision
loops (keep `Score` only if you want it as a pure scoreboard).

```js
// js/Laser.js
collision(){
  for (let i = lasersGroup.length - 1; i >= 0; i--) {
    const laser = lasersGroup.get(i);
    for (let j = enemiesGroup.length - 1; j >= 0; j--) {
      const enemy = enemiesGroup.get(j);
      if (laser.isTouching(enemy)) {
        spawnExplosion(enemy.x, enemy.y);
        score += enemy.points || 100;   // set enemy.points at spawn time
        enemy.remove();                  // p5.play: removes from all groups
        laser.remove();
        break;                           // this laser is gone, stop inner loop
      }
    }
  }
}
```
```js
function spawnExplosion(x, y){
  const ex = createSprite(x, y, 50, 50);
  ex.addAnimation("boom", explosion_2);  // use the real animation you loaded
  ex.scale = 0.3;
  ex.life = 13;                          // frames; matches explosion_2 length
}
```

Notes:
- Iterate **backwards** so removing items doesn't skip the next one.
- `sprite.remove()` (p5.play) deletes the sprite and pulls it from every Group,
  so you don't need the manual `enemies[]`/`lasers[]` arrays at all (see #3).
- Decide a real "needs 2 hits" rule with per-enemy HP if you want it (see end).

---

## 2. `Player.health()` overwrites itself + no game-over

**Problem.** The method reads/writes `this.health` (the *method*) instead of
`this.healthP`. The `<= 0` check never fires and `this.health = 0` would clobber
the function. There is also no `"over"` state.

**Before** (js/Player.js):
```js
health(loss){
  this.healthP = this.healthP - loss;
  if (this.health <= 0) {   // bug: this.health is a function
    this.health = 0;        // bug: overwrites the method
  }
  return this.healthP;
}
```

**After:**
```js
health(loss){
  this.healthP -= loss;
  if (this.healthP <= 0) {
    this.healthP = 0;
    gameState = "over";     // requires the "over" state below
  }
  return this.healthP;
}
```

Wire up the missing state in `Game.start()` (js/Game.js):
```js
else if (gameState === "over") {
  gameObj.gameOver();
}
```
```js
// js/Game.js
gameOver(){
  background("black");
  textAlign(CENTER);
  textSize(40);
  fill("white");
  text("GAME OVER", width/2, height/2 - 20);
  textSize(20);
  text("Score: " + score, width/2, height/2 + 20);
  text("click to restart", width/2, height/2 + 60);
  if (mouseIsPressed) resetGame();
}
```

And draw the health somewhere in `level1()`:
```js
text("HP: " + playerObj.healthP, 250, 45);
```

---

## 3. Backing arrays never shrink (slow leak)

**Problem.** `enemies.push(...)` and `lasers.push(...)` grow forever; destroyed
sprites stay in the arrays, so collision loops do more work each frame and test
dead sprites.

**Fix — preferred:** delete the parallel arrays entirely and use the p5.play
`Group`s you already maintain (`enemiesGroup`, `lasersGroup`). Groups
auto-remove sprites on `.remove()`. The rewrite in #1 already does this.

**Fix — if you keep arrays:** splice on destroy.
```js
function killSprite(sprite, arr){
  const k = arr.indexOf(sprite);
  if (k !== -1) arr.splice(k, 1);
  sprite.remove();
}
```

---

## 4. Ramming an enemy *rewards* you

**Problem.** In `Player.checkCollision()`, touching an enemy subtracts health
**and** adds score — so crashing is good.

**Before** (js/Player.js):
```js
if (player.isTouching(enemiesRedGroup1[i])) {
  playerObj.health(8);
  enemiesRedGroup1[i].destroy();
  score += 100;            // reward for crashing — wrong
}
```

**After** (damage only, no score; one loop over the universal group):
```js
checkCollision(){
  for (let i = enemiesGroup.length - 1; i >= 0; i--) {
    const enemy = enemiesGroup.get(i);
    if (player.isTouching(enemy)) {
      playerObj.health(20);   // bigger penalty than a near-miss
      enemy.remove();
      // no score on collision
    }
  }
}
```

---

## 5. `frameRate` set in three places

**Problem.** `setup()` sets 144, top of `draw()` sets 48, and `level1()` has
commented attempts. Because spawn timing is frame-based, this silently changes
difficulty.

**Fix.** Pick one value, set it once in `setup()`, and delete the rest.
```js
// sketch.js setup()
frameRate(60);   // one source of truth
```
Remove `frameRate(48)` from `draw()` and all `frameRate(144)` lines elsewhere.

> Better long-term: make spawns time-based (`millis()` / `deltaTime`) instead of
> frame-based so difficulty is independent of FPS. Optional for the revamp.

---

## 6. `createEnemies()` divide-by-zero (dead code)

**Problem.** `enemy.lifetime = displayHeight/(yv-1)` → `Infinity` when `yv === 1`.
The method is never called, but if you revive it, guard it.

**Before** (js/Enemies.js):
```js
enemy.lifetime = displayHeight / (yv - 1);
```

**After:**
```js
enemy.life = yv > 1 ? Math.round(displayHeight / (yv - 1)) : 600;
```
If you don't plan to use random spawns, just delete `createEnemies()`.

---

## 7. Plane 2 maps to the wrong sprite

**Problem.** In `level1()`'s switch, `case 2` uses `plane1`.

**Before** (js/level.js):
```js
case 2:
  player.addAnimation("simple", plane1);   // should be plane2
  break;
```

**After:**
```js
case 2:
  player.addAnimation("simple", plane2);
  break;
```

---

## 8. `addAnimation` given a static image

**Problem.** `player.addAnimation("simple", plane1)` passes an *image* where an
animation is expected. It works by luck of p5.play being lenient.

**After:** use `addImage` for static art, `addAnimation` only for real
animations.
```js
player.addImage(plane1);          // static plane sprite
// player.addAnimation("fly", planeFlyAnim);  // only if you have frames
```

---

## 9. Plane selection: replace nine-way ladders with data

**Problem.** `selectPlane()` and `selectPlaneOther()` are two ~80-line `if/else`
ladders that hardcode all nine `.scale` values per branch.

**Before** (SelectPlane.js — one of 18 near-identical blocks):
```js
if (mousePressedOver(planeMenu1) && gameState === "selectPlane") {
  planeNumber = 1;
  planeMenu1.scale = 0.75; planeMenu2.scale = 0.6; /* …7 more… */
}
else if (mousePressedOver(planeMenu2) && ...) { /* … */ }
// …×9
```

**After** — store the tiles in an array, loop once:
```js
// build once in displayPlane():
this.tiles = [planeMenu1, planeMenu2, planeMenu3,
              planeMenu4, planeMenu5, planeMenu6,
              planeMenu7, planeMenu8, planeMenu9];

selectPlane(){
  if (gameState !== "selectPlane") return;
  this.tiles.forEach((tile, idx) => {
    if (mousePressedOver(tile)) planeNumber = idx + 1;
  });
  this.refresh();
}

// replaces selectPlaneOther(): keep the chosen tile enlarged every frame
refresh(){
  this.tiles.forEach((tile, idx) => {
    tile.scale = (planeNumber === idx + 1) ? 0.75 : 0.6;
  });
}

destroyP(){ this.tiles.forEach(t => t.remove()); }
```
~230 lines → ~20, and adding a 10th plane is one array entry.

---

## 10. Tame the global namespace

**Problem.** sketch.js declares ~100 globals, incl. `back1..back36`,
`plane1..plane9`, `planeMenu1..planeMenu9`.

**After** — load numbered assets in a loop into arrays.
```js
// preload()
let backFrames = [];
for (let i = 0; i <= 35; i++) {
  const n = String(i).padStart(2, "0");
  backFrames.push(loadImage(`b/frame_${n}_delay-0.03s.gif`));
}
back = loadAnimation(...backFrames);

let planes = [];
const planeFiles = [1,2,9,6,5,3,7,8,4];   // your original order
for (const f of planeFiles) planes.push(loadImage(`images/plane/Plane_${f}.PNG.png`));
```
Then index `planes[planeNumber-1]` instead of a 9-case switch. Same idea for the
enemy images (an object keyed by colour reads well):
```js
const enemyImg = {
  red:   loadImage("images/enemyPlane/Enemy_Plane_Red.png"),
  green: loadImage("images/enemyPlane/Enemy_Plane_Green.png"),
  // …
};
```

---

## 11. Remove dead code & unused assets

Safe to delete in the revamp (verify first):

- `matter.js` — loaded in index.html, never used.
- `myOwnLibrary.js` — superseded by p5.play collisions (keep as a memento if you like, but drop the `<script>` tag).
- `img/` tank set + `tanks.json`, `decor_tank.gif` — assets from a different game.
- `images/plane/Plane_9@bad.PNG.png`, duplicate `Enemy_Plane_Red2.png`.
- `.tmp.drivedownload/` — Google Drive sync leftover.
- Commented-out blocks: `rescueMan`, `sirjan` rotation demo, `backSprite`,
  the large commented collision experiments in js/Laser.js.
- Empty `display(){}` stubs in every class.

---

## Bonus: a cleaner enemy model

If you want hits-to-kill done right, give each enemy HP instead of the global
`et`/`j`/`k`/`l` counters:

```js
// at spawn:
enemy.hp = 2;
enemy.points = 150;

// in laser collision:
if (laser.isTouching(enemy)) {
  laser.remove();
  enemy.hp -= 1;
  if (enemy.hp <= 0) {
    spawnExplosion(enemy.x, enemy.y);
    score += enemy.points;
    enemy.remove();
  }
}
```
This removes the shared mutable counters that currently make kills feel random.

---

## Suggested order to tackle these

1. #1 collision consolidation (unblocks #3).
2. #3 drop the parallel arrays.
3. #2 health + game-over loop (makes the game actually losable).
4. #4 fix ram-reward.
5. #5 single frameRate.
6. #7, #8 quick correctness fixes.
7. #9, #10 readability refactors.
8. #11 cleanup.
9. Bonus: per-enemy HP.
