# Sky Force — Implementation Plan

Turns [ANALYSIS.md](ANALYSIS.md) (how it's built) and [FIXES.md](FIXES.md) (what's
broken) into an ordered, executable revamp plan **for this copied folder** — not
the original `FINAL-PROJECT`, which stays untouched.

The code here matches the notes exactly (verified): the self-overwriting
`Player.health()`, the two parallel collision systems, the ram-reward, the
ever-growing `enemies[]`/`lasers[]` arrays, and the `frameRate` set in three
places are all present.

## Goal

A single, losable, restartable game with **one** collision system, **one**
frame rate, no per-frame leaks, and the numbered-global/nine-way-ladder code
collapsed into data-driven loops — without changing the look or feel.

## Ground rules

- No build step is introduced. It stays plain p5.js loaded via `index.html`.
- Test after every phase by opening `index.html` and playing through
  **menu → selectPlane → play → game over → restart**.
- One concern per commit; phases are ordered so each leaves the game runnable.
- Keep the good instincts from ANALYSIS.md §10 (one class per concern,
  frame-gated wave scheduler, per-enemy collider tuning, inline comments).

---

## Phase 0 — Safety net & single frame rate (FIXES #5)

Low risk, makes later phases measurable.

- [ ] Pick one frame rate. Set `frameRate(60)` once in `setup()`
      ([sketch.js](sketch.js)).
- [ ] Delete `frameRate(48)` from the top of `draw()` and every other
      `frameRate(144)` / commented `frameRate(...)` (in [Laser.js](js/Laser.js),
      [level.js](js/level.js)).
- [ ] Sanity-check that spawn cadence still feels right; the frame-gated
      schedule in `level1()` is tuned to FPS, so note the chosen value.

**Done when:** `frameRate()` is assigned in exactly one place and the game runs.

---

## Phase 1 — One collision system (FIXES #1, unblocks #3)

The core fix. Today [Laser.js `collision()`](js/Laser.js#L24) (array-based,
teleports to `x=800`, 2 hits via global `et`) and [score.js `score1()`](js/score.js)
(group-based, explosions + score via `j/k/l`) both run every frame and disagree.

- [ ] Make `Laser.collision()` the single owner of laser↔enemy: iterate
      `lasersGroup` × the enemy group(s) **backwards**, and on a hit destroy the
      laser, spawn the explosion, add score, remove the enemy.
- [ ] Add a `spawnExplosion(x, y)` helper using the real `explosion_2`
      animation already loaded in `preload()`, with `sprite.life` set to the
      animation length so it self-cleans.
- [ ] Set `enemy.points` at spawn time in [Enemies.js](js/Enemies.js) so scoring
      lives with the enemy, not in scattered `score += 100/150`.
- [ ] Strip the collision/scoring loops out of `Score.score1()`. Keep `Score`
      only as a pure scoreboard, or fold it into the HP display in Phase 2.
- [ ] Delete the large commented collision experiments in [Laser.js](js/Laser.js).

**Done when:** shooting an enemy kills it once, plays one explosion, and adds
score exactly once. No teleport-to-800 behavior remains.

---

## Phase 2 — Drop the parallel arrays (FIXES #3)

- [ ] Remove `enemies.push(...)` / `lasers.push(...)` and the `enemies[]` /
      `lasers[]` globals entirely; rely on the p5.play `Group`s, which
      auto-remove on `sprite.remove()`.
- [ ] Replace any remaining `.destroy()` + manual array bookkeeping with
      `sprite.remove()`.

**Done when:** no array grows over a long play session (verify by logging
`enemiesGroup.length` / `lasersGroup.length` — they should stay bounded).

---

## Phase 3 — Health, game-over, restart (FIXES #2)

Makes the game actually losable. Currently `Player.health()` writes to the
method (`this.health`) instead of `this.healthP`, so the `<= 0` check never fires.

- [ ] Fix `health(loss)` to use `this.healthP`, clamp at 0, and set
      `gameState = "over"` ([Player.js](js/Player.js#L31)).
- [ ] Add an `"over"` branch to `Game.start()` calling a new
      `Game.gameOver()` (black screen, "GAME OVER", final score, "click to
      restart") ([Game.js](js/Game.js#L6)).
- [ ] Add `resetGame()`: clear enemy/laser/explosion groups, reset `score`,
      `healthP`, frame counters (`fc1/fc2/fc3`, `frameC`), back to `gameState`.
- [ ] Draw `HP: <healthP>` alongside the score in `level1()`.

**Done when:** taking enough damage shows the game-over screen and a click
restarts a clean run.

---

## Phase 4 — Stop rewarding crashes (FIXES #4)

- [ ] Rewrite `Player.checkCollision()` as one backward loop over the universal
      enemy group: on touch, apply damage (e.g. `health(20)`) and `remove()` the
      enemy — **no** `score += ...` ([Player.js](js/Player.js#L6)).

**Done when:** ramming an enemy costs HP and never adds points.

---

## Phase 5 — Quick correctness fixes (FIXES #6, #7, #8)

- [ ] [#7] In `level1()`'s plane switch, `case 2` must use `plane2`, not
      `plane1` ([level.js](js/level.js)).
- [ ] [#8] Use `player.addImage(...)` for static plane art; reserve
      `addAnimation` for real multi-frame animations.
- [ ] [#6] Either delete the never-called `createEnemies()` or guard its
      divide-by-zero (`yv > 1 ? ... : 600`) ([Enemies.js](js/Enemies.js)).

**Done when:** every plane index shows its own sprite and no dead method can
produce `Infinity` lifetimes.

---

## Phase 6 — Data-driven refactors (FIXES #9, #10)

Behavior-preserving readability work; do after the game is correct.

- [ ] [#9] Replace the two ~80-line nine-way ladders in
      [SelectPlane.js](SelectPlane.js) (`selectPlane()` / `selectPlaneOther()`)
      with a `this.tiles[]` array + a `refresh()` loop that enlarges the chosen
      tile each frame. (~230 lines → ~20.)
- [ ] [#10] Load numbered assets in loops into arrays/objects instead of
      ~100 globals: `backFrames[]` for `back1..back36`, `planes[]` for
      `plane1..plane9` (preserving the original file order), and an
      `enemyImg{}` object keyed by color ([sketch.js](sketch.js)).
- [ ] Index `planes[planeNumber-1]` instead of the 9-case switch in `level1()`.

**Done when:** plane selection and backgrounds look identical, but `sketch.js`
no longer carries the numbered-global wall and adding a plane is one array entry.

---

## Phase 7 — Cleanup (FIXES #11)

Verify each is truly unused before deleting.

- [ ] Drop `<script src="matter.js">` and the file (loaded, never used).
- [ ] Drop the `myOwnLibrary.js` `<script>` tag (superseded by p5.play
      collisions); keep the file as a memento if desired.
- [ ] Remove unused assets: `img/` tank set + `tanks.json`, `decor_tank.gif`,
      `images/plane/Plane_9@bad.PNG.png`, duplicate `Enemy_Plane_Red2.png`,
      `.tmp.drivedownload/`.
- [ ] Remove commented dead blocks (`rescueMan`, `sirjan` rotation demo,
      `backSprite`) and the empty `display(){}` stubs in every class.

**Done when:** `index.html` loads only scripts the game uses and the tree has no
foreign-game assets.

---

## Phase 8 — Bonus: real hits-to-kill (FIXES "Bonus")

Optional polish once the single collision system is stable.

- [ ] At spawn set `enemy.hp` and `enemy.points`; in laser collision decrement
      `hp` and only explode/score/remove at `hp <= 0`. Removes the shared
      mutable `et`/`j`/`k`/`l` counters that make kills feel random.

**Stretch (from FIXES #5 note):** make spawns time-based (`millis()` /
`deltaTime`) so difficulty no longer depends on FPS.

---

## Sequencing rationale

1 → 2 (collision before dropping the arrays it used) → 3 (losable) → 4
(ram fix) → 5 (cheap correctness) → 6 (refactor once correct) → 7 (cleanup) →
8 (bonus). Phase 0 first so frame timing is fixed while everything else changes.
Each phase ends with the game runnable, so any phase can be a stopping point.

---

# Part II — game revamp (phases 9+)

After Phase 8 the codebase is *correct* but the game is still a single
endless wave with no real progression. The next phases turn it into an
actual playable game using the already-bundled-but-unused assets in
`Basic/` (animated enemy fighter, shield/speed/coin power-ups, rocks,
space-shooter background) and `images/explosionA` (17-frame explosion
animation that was preloaded but never displayed).

## Phase 9 — Folder reorganization

- Move third-party libs (`p5.*`, `matter.js`, `myOwnLibrary.js`) into `lib/`
- Move all game classes (`SelectPlane.js` + everything in `js/`) into a
  unified `js/` tree
- Move sprites/sounds into `assets/sprites/`, `assets/sounds/`,
  `assets/anim/`
- Update `index.html` script paths
- Delete obvious cruft (`.tmp.drivedownload`, broken `.rar` / `.zip`,
  copies-of-copies, stray jpgs at root)

## Phase 10 — Scrolling space background + screen shake + better explosions

- Use `Basic/Space-Shooter-Background.jpg` as a vertically-scrolling
  background instead of solid black
- Wire up the preloaded `explosionA` 17-frame animation as the kill VFX
  (replaces the static `EXPLODE.png`)
- Add a global screen-shake helper triggered when the player takes damage

## Phase 11 — Animated enemies + enemies that shoot back

- Use `Basic/Enemu-FighterJet/Enemy-Fighterget/` (8-frame loop) for a new
  "fighter" enemy variant that fires periodic projectiles at the player
- New `EnemyLaser` sprite group; player-vs-enemyLaser overlap deducts HP
- Existing red/red2/N variants kept; fighter is the new mid-difficulty
  threat

## Phase 12 — Power-ups

- New `PowerUp` class with four types backed by existing animations:
  - **shield** (`Basic/Shield-PowerUps/`) — temporary invulnerability
  - **rapidfire** (`Basic/Speed-Booster/`) — halves laser cooldown
  - **heal** — restores 25 HP (uses coin sprite)
  - **score-multiplier** — 2x score for a window
- Drop chance on enemy death (small for fry, higher for big N + boss)
- Pickup collision with player; HUD shows active timers

## Phase 13 — Level system

- `LEVELS` data table: per-level duration, spawn-wave config, boss flag,
  background tint
- Three levels with distinct enemy mixes:
  - L1: red/red2 fry + occasional fighter
  - L2: heavier fighter waves + N formations
  - L3: mixed chaos leading into the boss
- "Level N" banner on start, "Level complete!" banner on finish
- HUD shows current level

## Phase 14 — Boss

- `Boss` class with multi-phase HP bar, side-to-side movement, bullet
  patterns
- Spawns at the end of level 3 (or each level — pick one); win condition
  on boss kill

## Phase 15 — Polish & shipping

- Pause (P key)
- High-score persistence via `localStorage`
- README rewrite (controls, levels, screenshots if I drop any)
- SFX hooks (synthesize beeps with p5.sound oscillators since only
  `laserShoot.mp3` ships with the repo)
- Final balance pass
