# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Pre-code. The directory holds only `PLAN.md` (design, locked decisions, phases). No build, lint, or test tooling exists yet. Read `PLAN.md` before starting; it is the source of truth. Update this file once code and commands exist.

## Game

Turn-based 3D tactical RPG on the LittleJS 3D plugin. Browser, solo, 3 to 5 hours. Player is a human in a suit built from salvaged machine tech; goal is to beat 1 to 2 corporations, then the central AI. Linear story, one ending, localStorage autosave at the hub, retry on failure (no permadeath).

## Engine setup

- LittleJS repo: `/home/raees/development/LittleJS`. Read its `AGENTS.md` and `REFERENCE.md` before writing engine code.
- Games import `../../LittleJS/dist/littlejs.esm.js`. This project sits outside that layout (`~/Desktop/littlejs-games/lets get it`), so either relocate under `/home/raees/development/littlejs-games/<game>/` or fix the import path. Serve from `/home/raees/development` so the relative path resolves.
- 3D plugin: `plugins/math3d.js`, `EngineObject3D`, GLTF, `HeightMap`/`VoxelMap`, 3D raycasting. Examples in `examples/3d/`; read them first (performance with many animated GLTFs is unverified).

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
