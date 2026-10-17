# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Foundation built in Godot 4.7: main menu, Play into a placeholder arena (`base_map`: checker `GridMap` floor, suit box, orbit camera), Esc pause menu with Resume and Main Menu. Next is Phase 1. Read `PLAN.md` before starting; it is the source of truth for design, locked decisions and phases. The LittleJS version this was ported from is in `../overwrite-little-js`.

## Running

- `godot --path .` runs the game, `godot -e --path .` opens the editor.
- `godot --headless --path . --script res://tests/flow_test.gd` runs the menu flow test; the exit code is the failure count.
- After adding files outside the editor, run `godot --headless --path . --import` so the UID cache knows them and script `.uid` files exist. Commit the `.uid` files.

## Game

Turn-based 3D tactical RPG in Godot. Solo, 3 to 5 hours. Player is a human in a suit built from salvaged machine tech; goal is to beat 1 to 2 corporations, then the central AI. Linear story, one ending, autosave at the hub, retry on failure (no permadeath).

## Engine setup

- Godot 4.7, GDScript, GL Compatibility renderer, Jolt physics.
- Read `docs/PROJECT RULES.md` before writing code and follow it: folder layout, naming, typing, scene structure, signals, autoloads, commit messages.
- GDScript warnings `unassigned_variable`, `unused_parameter`, `unused_signal`, `unreachable_code`, `untyped_declaration` are errors in `project.godot`.
- Reach for engine features before writing your own: `GridMap` for the board, the project `Theme` for UI look, tree pause plus `process_mode` for pausing, `change_scene_to_packed` for scenes.
- Colours: UI colours live in `assets/ui_theme.tres` (the project default theme); 3D colours in the scene materials and the map's `WorldEnvironment`. Code that needs a colour uses `scripts/lib/palette.gd` (create it with the first such colour).
- Input actions: `pause` (Esc), `orbit` (left mouse), `zoom-in` and `zoom-out` (wheel).

## Architecture constraints (from PLAN.md)

- Combat: grid with action points, cover, positioning, on a `GridMap` floor. Orbit camera, tactical default angle.
- Suit: slotted modules (head, torso, arms, legs, core) under a power/heat budget; each module changes the 3D model (4 to 6 variants per slot).
- Models are primitive meshes until Phase 5 (Blender GLTF). Keep a single model-per-module lookup so the swap touches one place.
- Enemies are machines only; variants via recolour or rescale.
- Structure: hub plus mission maps; progression from enemy salvage crafted at the hub.
- Low-poly look, limited palette.
- Out of scope: branching story, multiple endings, squad, permadeath, open world, cutscenes.

## Phases

Each phase must be playable alone: 1 combat slice, 2 suit system, 3 salvage and hub, 4 campaign, 5 polish. Hardest parts (grid AI, 3D camera, tile picking) are tested first in Phase 1. If content overruns, cut missions before cutting phases.

## Coding principles

- **KISS**: the simplest code that fully works. Use an engine node or resource first. Add an abstraction once a second caller needs it.
- **DRY**: one source of truth per meaning. Shared look in the theme, shared node trees as scenes, the suit's model-per-module lookup in one file. A block written twice becomes a function or a scene.
- **SOLID**, applied to Godot:
  - Single responsibility: one job per script. Scenes wire nodes together; game rules (grid, AP, AI, suit stats, damage) live in `scripts/lib/`.
  - Open/closed: extend through signals, exported resources and lookup tables, so new content is new data.
  - Liskov: a script that extends another keeps its contract, and calls `super()` in lifecycle methods it overrides (Godot 4 does not call the base version on its own).
  - Interface segregation: small typed methods and signals; a scene exposes only what its parent needs.
  - Dependency inversion: game rules are plain scripts over plain data with no node or scene tree access, so headless tests can run them; nodes call them.
- Every new rule script in `scripts/lib/` ships with a test in `tests/`.
- Keep files under about 300 lines; split by responsibility when one grows past that.
