# Plan

## Game
Turn-based 3D tactical RPG built on the LittleJS 3D plugin. Browser, solo, about 3 to 5 hours.
Machines and corporations rule the world. You are one human in a suit you build from salvaged machine tech.
Goal: beat 1 to 2 corporations, then the central AI that controls the machines.
Linear text story, one ending, localStorage autosave at the hub. Retry on failure, no permadeath.

## Locked decisions
- Engine: LittleJS 3D plugin (`plugins/math3d.js`, `EngineObject3D`, GLTF, `HeightMap`/`VoxelMap`, 3D raycasting). Low-poly look, limited palette.
- Camera: orbit, tactical default angle, close-up on attacks.
- Combat: grid with action points, cover and positioning, on a `VoxelMap` or `HeightMap` floor.
- Suit: slotted modules (head, torso, arms, legs, core) under a power/heat budget. Each module visibly changes the 3D model, 4 to 6 variants per slot.
- Enemies: machines only. Variants made by recolour or rescale.
- Models: dummy primitives (boxes, cylinders) built in code for now. Swap to Blender GLTF in Phase 5. Keep one model-per-module lookup so the swap touches one place.
- Structure: hub plus mission maps. Progression comes from enemy salvage crafted at the hub.

## Phases
Each phase is playable on its own.

1. **Combat slice**: one arena, grid, orbit camera, suit with 3 placeholder modules, one enemy type, AP moves and attacks, win/lose. Exit test: is it fun with cube art?
2. **Suit system**: slots, module stats and abilities, power/heat budget, equip screen, visible suit changes, 3 to 4 enemy types with distinct behaviours.
3. **Salvage and hub**: enemies drop parts and blueprints, hub with craft/equip menu, mission select, autosave.
4. **Campaign**: 8 to 12 missions across 1 to 2 corporations, bosses, final AI, text briefings and terminal logs, difficulty curve.
5. **Polish**: real Blender models, audio, attack close-ups, balance, UI.

## Out of scope
Branching story, multiple endings, squad, permadeath, open world, cutscenes.

## Risks
- Grid AI, 3D camera and tile picking are the hardest parts. Phase 1 tests them first.
- Phase 4 content volume could overrun. Cut missions before cutting phases.
- Not checked: LittleJS 3D plugin performance with many animated GLTFs. Read `examples/3d/` at the start of Phase 1.
