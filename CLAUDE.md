# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Foundation built: main menu, Play into a placeholder arena (tile floor, suit box, orbit camera), Esc pause menu with Resume and Main Menu. Next is Phase 1. Read `PLAN.md` before starting; it is the source of truth for design, locked decisions and phases.

## Running

- `make run` serves `~/Desktop` and opens the game. `~/Desktop/LittleJS` is a symlink to `/home/raees/development/LittleJS`, which is how `src/engine.js` reaches the engine. The server exposes all of `~/Desktop`, so keep `--bind 127.0.0.1`.
- `npm test` runs the headless node tests.
- Esc is the pause key, so the debug overlay is on Backquote (`` ` ``).

## Game

Turn-based 3D tactical RPG on the LittleJS 3D plugin. Browser, solo, 3 to 5 hours. Player is a human in a suit built from salvaged machine tech; goal is to beat 1 to 2 corporations, then the central AI. Linear story, one ending, localStorage autosave at the hub, retry on failure (no permadeath).

## Engine setup

- LittleJS repo: `/home/raees/development/LittleJS`. Read its `AGENTS.md` and `REFERENCE.md` before writing engine code.
- Import engine names from `src/engine.js` only; it holds the one engine path.
- 3D plugin: `plugins/math3d.js`, `EngineObject3D`, GLTF, `HeightMap`/`VoxelMap`, 3D raycasting. Examples in `examples/3d/`; read them first (performance with many animated GLTFs is unverified).
- Reach for engine plugins before writing your own: `setScene` (sceneSystem), `UISystemPlugin`, `CameraControl3D`, `render3D.pick`, pathFinder.
- Scenes are plain objects with the sceneSystem hooks plus `updatePost`, which `main.js` calls every tick, paused included.
- Headless test gotchas: the debug build's 3D editor reads `document` (stub it), and UI `nativeHeight` scaling divides by the zero canvas size (set it to 0). `tests/flow.test.mjs` does both.

## Architecture constraints (from PLAN.md)

- Combat: grid with action points, cover, positioning, on a `VoxelMap` or `HeightMap` floor. Orbit camera, tactical default angle.
- Suit: slotted modules (head, torso, arms, legs, core) under a power/heat budget; each module changes the 3D model (4 to 6 variants per slot).
- Models are code-built primitives until Phase 5 (Blender GLTF). Keep a single model-per-module lookup so the swap touches one place.
- Enemies are machines only; variants via recolour or rescale.
- Structure: hub plus mission maps; progression from enemy salvage crafted at the hub.
- Low-poly look, limited palette.
- Out of scope: branching story, multiple endings, squad, permadeath, open world, cutscenes.

## Phases

Each phase must be playable alone: 1 combat slice, 2 suit system, 3 salvage and hub, 4 campaign, 5 polish. Hardest parts (grid AI, 3D camera, tile picking) are tested first in Phase 1. If content overruns, cut missions before cutting phases.

## Coding principles

- **KISS**: the simplest code that fully works. Use an engine feature first. Add an abstraction once a second caller needs it.
- **DRY**: one source of truth per meaning. Colours and tuning numbers live in `src/config.js`, shared UI builders in `src/ui/`, the suit's model-per-module lookup in one file. A block written twice becomes a function.
- **SOLID**, applied to plain ES modules:
  - Single responsibility: one job per module. Scenes wire engine objects together; game rules (grid, AP, AI, suit stats, damage) live in their own modules.
  - Open/closed: extend through hooks and lookup tables, so new content is new data and `main.js` stays as it is.
  - Liskov: an `EngineObject3D` subclass keeps the base contract, calling `super.update()` and `super.destroy()` when it overrides them.
  - Interface segregation: small named exports; each file imports only the names it uses.
  - Dependency inversion: game rules are pure functions over plain data with no engine import, so they run in node tests; engine-facing code calls them.
- **File management**:
  - Layout: `index.html` entry page; `src/main.js` engine start, plugins, first scene; `src/engine.js` engine re-export; `src/config.js` palette and constants; `src/scenes/` one scene per file; `src/ui/` shared UI builders; `tests/` headless `*.test.mjs`. Add a folder per system as phases need it (`src/combat/`, `src/suit/`, `src/models/`).
  - One concept per file, camelCase, named after its main export (`gameScene.js` exports `gameScene`).
  - Keep files under about 300 lines; split by responsibility when one grows past that.
  - Plain ES modules served as they are: zero build steps, zero runtime dependencies.
  - Every new rule module ships with a test in `tests/`.
- **Style**: match the LittleJS source: 4-space indent, braces on their own line, single quotes, `()=>` arrows, one-line comments that say why.
