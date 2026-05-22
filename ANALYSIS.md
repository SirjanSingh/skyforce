# Sky Force — Architecture & Patterns

A map of how the original `FINAL-PROJECT` code is put together. File references
point at the original repo.

## 1. Load order & entry point

`index.html` loads scripts in dependency order: libraries first, then game
classes, then `sketch.js` last. Everything lives in the **global scope** — there
are no modules, no bundler.

```
libs (p5, p5.play, p5.sound, p5.gif, matter)
  -> js/Player, js/Enemies, js/Game, js/Back, js/Laser, js/score, js/level
  -> SelectPlane.js, myOwnLibrary.js
  -> sketch.js   (p5 preload / setup / draw)
```

## 2. The state machine

A single global `gameState` string controls which screen is active:

```
"menu"  --click startGame-->        "play"
"menu"  --click plane_Selection-->  "selectPlane"
"selectPlane" --click backButton--> "menu"
```

`Game.start()` (js/Game.js) runs every frame from `draw()` and routes on
`gameState`. It is the central dispatcher. Frame-counter guards (`fc1`, `fc2`,
`fc3`) debounce the screen transitions so a single click doesn't fire twice.

> Missing state: there is no `"over"` screen. The hooks for it exist
> (`// gameState = "over"`) but were never wired up. See FIXES.md #2.

## 3. The manager-singleton pattern

Each concern is a class instantiated exactly once in `setup()`. Classes are used
as **namespaces**, not for multiple instances. Every class also has an empty
`display(){}` method — a convention that was stubbed everywhere but never used.

| File | Class | Singleton | Responsibility |
|---|---|---|---|
| js/Player.js | `Player` | `playerObj` | health, player↔enemy collision |
| js/Enemies.js | `Enemies` | `enemiesObj` | enemy spawning + movement/rotation |
| js/Game.js | `Game` | `gameObj` | state routing |
| js/Laser.js | `Laser` | `laserObj` | bullet spawning + laser↔enemy collision |
| js/score.js | `Score` | `scoreObj` | explosions + scoring on hit |
| js/level.js | `Level` | `levelObj` | gameplay loop + spawn schedule |
| js/Back.js | `Back` | `backObj` | "back" button teardown |
| SelectPlane.js | `Select_Plane` | `selectObj` | plane picker UI |

## 4. The p5 lifecycle (sketch.js)

- **preload()** — loads everything up front: 9 player planes, 7 enemy sprites,
  two explosion animations (17 + 13 frames), 36 background GIF frames
  (`back1..back36`) combined into one `loadAnimation`, bullets, and sounds.
- **setup()** — `createCanvas(500, displayHeight)`, `angleMode(DEGREES)`,
  creates all p5.play `Group`s and the manager singletons, builds the menu
  sprites, `frameRate(144)`.
- **draw()** — clears to black, `frameRate(48)`, `gameObj.start()`, snaps the
  player sprite to the mouse, `drawSprites()`, draws score text.

## 5. Gameplay loop (js/level.js `level1()`)

The heart of the game. Each frame while playing it:

1. Shows the player sprite and applies the chosen plane animation (switch on `planeNumber`).
2. Runs scoring (`scoreObj.score1()`) and player collision (`playerObj.checkCollision()`).
3. **Spawns enemy waves on a frame-gated schedule**, e.g.:
   ```js
   if (frameC % 15 === 0 && frameC > (fc3 + 75) && e1r < 5) {
       enemiesObj.enemiesRed1(0, 120, 5, 0);   // wave of 5, left->right
   }
   ```
   `fc3` is stamped when play begins, so every wave is timed relative to game start.
   Per-wave caps (`e1r < 5`, `e3n1 < 8`, …) limit how many spawn.
4. Applies entry rotations to the diagonal waves (`rotateE12`, `enemiesN1` with `t`).
5. Auto-fires a laser every 4th frame (`if (frameC % 4 === 0) laserObj.createLasers()`).
6. Runs laser collision (`laserObj.collision()`).

## 6. Spawn vocabulary (js/Enemies.js)

- `enemiesRed1(x,y,xv,yv)` / `enemiesRed2(...)` — horizontal red waves from the
  left / right edges, added to `enemiesRedGroup1` / `enemiesRedGroup2`.
- `enemiesN1(x,y,xv,yv,t)` — the "new" enemy that descends; `t` (1–4) selects a
  lane and an entry rotation (±22.5° for diagonals, straight for `t=3/4`).
- `rotateE12(x,y,q)` — turns a red wave when it crosses a screen-x threshold,
  giving a "bank and dive" feel.
- `createEnemies(...)` — a random-enemy spawner that is **defined but never
  called** (dead code).

The cryptic counter names are documented inline in the source:
`e1r` = enemy/round-1/red, `e1rex` = "existence" flag, `ne[]` = spawn counter,
`et`/`lcv` = laser-hit counters.

## 7. Collision: two parallel systems

This is the most important thing to understand before a rewrite — there are
**two independent collision implementations running at once**:

- **Array-based** (js/Laser.js `collision()`): loops `enemies[]` × `lasers[]`,
  uses a global `et` counter, requires 2 hits, then teleports the enemy to
  `x=800` instead of destroying it.
- **Group-based** (js/score.js `score1()`): loops the `enemiesRedGroup*` /
  `enemiesGroupN` Groups with `lasersGroup.isTouching`, uses separate `j/k/l`
  counters, spawns the explosion sprite, and adds score.

They double-count, disagree on what "killed" means, and the backing arrays
(`enemies[]`, `lasers[]`) are never cleaned up. FIXES.md #1 and #3 cover this.

## 8. Plane selection UI (SelectPlane.js)

A 3×3 grid of `planeMenu1..9` sprites. Selection is handled by two near-identical
nine-branch `if/else` ladders:

- `selectPlane()` — sets `planeNumber` on click and enlarges the picked tile.
- `selectPlaneOther()` — re-applies the enlarged scale every frame so the
  selection stays visually "stuck".

Each branch hardcodes all nine `.scale` values. ~230 lines that a data-driven
loop reduces to ~15 (FIXES.md #7).

## 9. Custom utility (myOwnLibrary.js)

Hand-rolled AABB `isTouching(a,b)` and `bounce(a,b)` written for an earlier
class project and imported here. The game actually relies on p5.play's built-in
`isTouching` / `setCollider`, so this file is effectively **dead code** — but
it's a nice artifact of learning collision math from scratch.

## 10. Conventions worth keeping vs. dropping

**Keep (good instincts):**
- One-concern-per-file class split.
- Frame-gated wave scheduler with per-wave caps.
- Per-enemy collider tuning (`setCollider("circle", …)`) for game feel.
- Honest, plentiful inline comments — they're why this is readable years later.

**Drop / rethink in the revamp:**
- ~100 globals in sketch.js (esp. `back1..back36`, `plane*`, `planeMenu*`).
- Two collision systems → pick one.
- Empty `display(){}` stubs everywhere.
- `frameRate` set in three different places.
- Numbered variables instead of arrays.
- Unused assets (`matter.js`, `img/` tank set + `tanks.json`, `decor_tank.gif`,
  `Plane_9@bad...`, `.tmp.drivedownload/`).
