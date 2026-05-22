# Sky Force

A vertical-scrolling space shooter built on **p5.js + p5.play**. Started as a
~6-year-old keepsake project; phases 0–15 here rebuilt it into an actual playable
game with multiple levels, power-ups, a boss, and a pause / restart loop.

## Play

Serve the folder over HTTP (so the browser can load the `assets/` files):

```
python -m http.server 8000
# then open http://localhost:8000
```

Any static file server works — VSCode's "Live Server", `npx http-server`, etc.
Don't open `index.html` directly with `file://` — most browsers refuse to load
audio/animation assets that way.

## Controls

| Input          | Action                                  |
| -------------- | --------------------------------------- |
| **Mouse**      | Fly the plane (player follows cursor)   |
| **Click**      | Pick options in the menu                |
| **P**          | Pause / resume                          |
| **R**          | Restart after Game Over or Victory      |

Lasers auto-fire. The plane-select screen (`SELECT PLANE` button on the menu)
lets you pick one of nine cosmetic planes — purely visual.

## Levels

| #   | Name              | What you'll see                                                          |
| --- | ----------------- | ------------------------------------------------------------------------ |
| 1   | Asteroid Belt     | Red fry only. Onboarding pace.                                           |
| 2   | Heavy Resistance  | Red waves + animated fighters that shoot back + N formations             |
| 3   | Final Push        | Everything overlapping, faster cadence, ends in a 2-phase **boss** fight |

Beating level 3's boss flips the game to the **VICTORY** screen.

## Power-ups

Enemies have a small chance to drop a power-up on death (much higher for big
enemies and the boss). Heal drops are favored when you're below 60 HP.

| Icon  | Type          | Effect                          |
| ----- | ------------- | ------------------------------- |
| 🛡️    | **Shield**    | 6 s of total damage immunity    |
| ⚡     | **Rapid-fire**| 6 s of halved laser cooldown    |
| ⭐     | **Heal**      | Instant +25 HP (cap 100)        |

Active timers show under the HP readout; a cyan pulsing ring marks the shield.

## Repo layout

```
.
├── index.html
├── README.md
├── ANALYSIS.md / FIXES.md / IMPLEMENTATION_PLAN.md   ← project notes
├── style.css, star-animation.css
├── lib/                third-party (p5*, matter, myOwnLibrary)
├── js/                 game classes + sketch.js
│   ├── sketch.js         draw loop, HUD, pause, restart, SFX, high score
│   ├── Game.js           state machine (menu / selectPlane / play)
│   ├── SelectPlane.js    plane picker grid
│   ├── level.js          LEVELS data table + wave dispatcher
│   ├── Enemies.js        red / red2 / fighter / N-formation spawn methods
│   ├── Laser.js          player lasers + spawnEnemyLaser helper + collision
│   ├── PowerUp.js        drop roll + pickup
│   ├── Boss.js           level-3 boss
│   ├── Player.js         HP, shield, rapid, collision with enemies & bullets
│   ├── Back.js           menu-back transition
│   └── score.js          shell kept for legacy callers
└── assets/
    ├── sprites/{planes,enemies,bullets,bg,ui}/
    ├── anim/{explosionA,explosionB,fighter,hero,shield,speed,coin,rock}/
    └── sounds/{laser.mp3, menu.mp3}
```

## How the game was built

The repo's history is one commit per implementation phase — the messages explain
**why** each change matters, not just what changed. Read them in order to follow
the revamp from "buggy 6-year-old code" to "playable 3-level shooter":

| Phase | Commit gist                                                          |
| ----- | -------------------------------------------------------------------- |
| 0     | Single `frameRate(60)` source of truth                               |
| 1     | Unified laser-vs-enemy collision via `group.overlap`                 |
| 2     | Killed parallel `enemies[] / lasers[]` arrays (memory leak)          |
| 3     | Fixed `this.health` bug, added Game Over + restart                   |
| 4     | Ramming no longer rewards score                                      |
| 5     | Plane-2 mapping, one-shot `addAnimation`, divide-by-zero guard       |
| 6     | SelectPlane: 290 lines → 86 (data table + loops)                     |
| 7     | Dead-JS sweep: −138 lines across sketch.js / Game.js / Enemies.js    |
| 8     | Per-enemy HP (N-ships take 3 hits)                                   |
| 9     | Folder reorganization into `lib/`, `js/`, `assets/`                  |
| 10    | Scrolling space background + 17-frame explosions + screen shake      |
| 11    | Animated fighter enemy + enemies that shoot back (`spawnEnemyLaser`) |
| 12    | Three power-ups (shield / rapid / heal) backed by bundled animations |
| 13    | `LEVELS` data table + 3 distinct levels + level-complete banner      |
| 14    | Two-phase boss with HP bar, side-bob, triple-spread fire at <50%     |
| 15    | Pause (P), localStorage high score, synthesized hit/boom SFX, README |

See [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) for the original
checkboxed plan and [`ANALYSIS.md`](ANALYSIS.md) / [`FIXES.md`](FIXES.md) for
the pre-revamp deep-dive on what was broken and how it was fixed.

## Tech stack

- [p5.js](https://p5js.org/) 1.x — canvas + draw loop
- [p5.play](https://p5play.org/v1/) v1 — sprites + groups (`Group.overlap`,
  `sprite.lifetime`, `addAnimation`, etc.)
- p5.sound — laser sample + synthesized hit/boom SFX via `Oscillator` +
  `Envelope`
- matter.js / p5.gif.js / p5.touchgui.js — bundled with the original repo;
  currently unused by the rewrite but kept under `lib/` in case future
  effects (physics asteroids, gif backgrounds, touch overlay) need them

## Assets

All sprites + animations + sounds were already in the original repo (most of
them were bundled-but-unused; the revamp wired them up). No external downloads.
Original credits unknown — the project predates any asset-attribution
discipline; if you recognize the art please open an issue and I'll add credit.

## License

The code is MIT-equivalent — feel free to fork, learn from, or vandalize.
