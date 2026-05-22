# Sky Force — Reference & Notes

This repository is a **companion reference** for the original game in `FINAL-PROJECT`
(https://github.com/SirjanSingh/FINAL-PROJECT.git).

The original is a vertical-scrolling space shooter written ~6 years ago in vanilla
JavaScript on top of **p5.js + p5.play**, self-taught from documentation. The code
there is intentionally left untouched — it's a keepsake.

This repo holds:

- **[ANALYSIS.md](ANALYSIS.md)** — full architecture walkthrough, patterns, and conventions found in the original code.
- **[FIXES.md](FIXES.md)** — every known bug and rough edge, with concrete before/after code showing how to fix it.

Nothing here changes the original game. Use it as a map when you eventually
revamp and polish the code.

## The game in one paragraph

Mouse-controlled fighter plane (`player` follows `mouseX/mouseY`). Auto-fires
lasers upward. Enemy planes spawn in scheduled waves and fly down/across the
500px-wide canvas. Hit enemies with lasers to score; an explosion plays on kill.
A `gameState` string machine drives three screens: **menu → selectPlane → play**.

## Tech stack

| Library | Role |
|---|---|
| p5.js | canvas, draw loop, input |
| p5.play | sprites, `Group`s, animations, `isTouching`, `setCollider` |
| p5.sound | laser SFX, menu track |
| p5.gif | animated GIF backgrounds |
| matter.js | loaded but unused |

No build step. Open `index.html` in a browser (or serve the folder) to run.
