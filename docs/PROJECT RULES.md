# Project Rules: overwrite

Must-follow rules for new and changed code. Godot 4.7, GDScript. Read with `PLAN.md` (design, locked decisions, phases).

---

## 1. Folder layout

| Path | Holds |
|---|---|
| `scenes/player/` | `player.tscn` (the suit) and its module model scenes. |
| `scenes/enemies/` | Machine enemy scenes, files prefixed `enemy_`. Variants are a recolour or rescale of one scene, not a new scene. |
| `scenes/maps/` | `base_map.tscn` (script `scripts/maps/map.gd`) and mission maps inherited from it, e.g. `mission_01.tscn`. |
| `scenes/props/` | Static map pieces: cover, walls, crates. |
| `scenes/effects/` | Visual feedback with no gameplay state: hit flashes, tile and range highlights. |
| `scenes/menus/` | Menu scenes. `scenes/menus/sub_menus/` for panels used inside another menu. |
| `scripts/` | Mirrors `scenes/`. `scripts/menus/pause_menu.gd` pairs with `scenes/menus/pause_menu.tscn`. |
| `scripts/globals/` | Autoload scripts only. |
| `scripts/lib/` | Scene-less scripts with no node of their own: grid, AP and damage rules, save file access, palette. Not autoloads. A script here has no paired `.tscn`. |
| `assets/` | Models, textures, `assets/shaders/`. Do not edit `.import` or `.uid` files by hand. |
| `docs/` | Design docs and this file. |

- New kind of scene: new subfolder under `scenes/`, and a row here.
- A script and its scene share a name: `player.gd` and `player.tscn`.
- Scene root node name = scene file name.
- Do not touch `.godot/`.

## 2. Naming

| Thing | Style | Example |
|---|---|---|
| Files, folders | snake_case | `pause_menu.gd` |
| Scene root node | same as file name | `player` |
| Child nodes | snake_case, add type suffix when not obvious | `mesh_instance_3d`, `collision_shape_3d`, `area_3d`, `move_timer` |
| `class_name` | PascalCase | `Player`, `CraftMenu` |
| Enum type | PascalCase | `ModuleSlot` |
| Enum members | UPPER_SNAKE | `HEAD`, `CORE` |
| Constants | UPPER_SNAKE | `MAX_AP` |
| Variables, functions, params | snake_case | `can_move`, `take_damage` |
| Private members | leading `_` | `_selected_tile` |
| Signals | snake_case, past tense (something happened) | `turn_ended`, `module_equipped` |
| Signal handlers, child signal | `_on_<node>_<signal>` | `_on_move_timer_timeout` |
| Signal handlers, global signal | `_on_<signal>` | `_on_turn_ended` |
| Input actions | lowercase kebab-case, names from `project.godot` | `end-turn`, `pause` |

Rules:
- Default Godot names (`MeshInstance3D`, `CollisionShape3D`, `Timer`) are not allowed. Rename them.
- Never hard-code a key. Use `Input.is_action_pressed("end-turn")`.
- Never write a hex color inline. Use the constants in `scripts/lib/palette.gd`.

## 3. Typing and warnings

Set these GDScript warnings to Error (Project Settings > Debug > GDScript): `unassigned_variable`, `unused_parameter`, `unused_signal`, `unreachable_code`, `untyped_declaration`. So:

- Type every variable, constant, parameter, and return value. Use the `: Type =` form.
- Functions with no return value: `-> void`.
- Unused parameter: prefix `_` (`_delta`).
- Unused signal or variable: delete it.
- Typed collections: `Array[Vector2i]`, `Dictionary[ModuleSlot, int]`.
- Indent with tabs. Prefer `and`, `or`, `not` over `&&`, `||`, `!`.

## 4. Scene structure

Split a node tree into its own scene when any of these is true:

1. The same thing appears in more than one place. Example: a module model shown on the suit and in the equip menu.
2. It has its own state or behavior and its own script. Example: `player.tscn`, an `enemy_` scene.
3. Its nodes form a unit that shows, hides, or moves together. Example: a menu panel.

Keep nodes in the same scene when they are only visual children with no logic: labels, margin containers, plain layout boxes.

Composition rules:
- Child scenes never reach up to their parent or into sibling scenes (`get_parent()`, `get_node("../...")`).
- The parent wires children. Expose needed references with `@export` and set them in the parent scene (`node_paths`).
- A reusable scene must work when instanced anywhere. No paths into a specific map.
- Map scenes group their nodes under plain `Node3D` parents by kind, e.g. `props`, `enemies`. New nodes go in the matching group, never at the map root.

## 5. Communication: which channel

| Need | Use |
|---|---|
| Parent tells child to do something | Call a typed method on the child reference. |
| Child reports to parent | Child emits a signal. Parent connects it, in the scene editor or in `_ready`. |
| Several unrelated nodes need one event | Signal on an autoload (global signal hub). |
| State shared across scenes | Variable on an autoload. |
| Node needs something in another scene | Do not look it up by path. Use an autoload signal or an `@export` set by the owning scene. |

**Global signal hub.** The autoload signals are the hub. Add a signal to an autoload only when:
- two or more unrelated nodes must react to the event, or
- the emitter can be freed or replaced by a scene change.

Do not use a global signal for parent-child events. A direct signal is enough.

Put each signal on the autoload that owns its data. Change an autoload's state only through its methods, never by writing its variables from another script.

## 6. Autoloads

- Only for state that must survive a scene change, or events several scenes share.
- One responsibility per autoload.
- Name new ones `global_<name>.gd` in `scripts/globals/`.
- Register in `project.godot` `[autoload]`.
- No visuals in autoloads.
- A node reference in an autoload is allowed only when the owning scene sets it in `_ready` and clears it on exit.
- Adding an autoload changes the whole project. Ask the user first.

## 7. Functions and lifecycle

Lifecycle:
- Setup and node wiring: `_ready`.
- Input events: `_input` or `_unhandled_input`.
- Movement and physics: `_physics_process`.
- Per-frame logic that is not physics: `_process`, only when needed.
- Delete empty lifecycle stubs (`_process` with only `pass`).

Implementation:
- One job per function. If a function needs a region comment to explain itself, split it.
- Group related functions with `#region - <topic>` and `#endregion`.
- Return early instead of nesting.
- Setters are idempotent: return early when the value is unchanged.
- Emit a signal after the state changes, not before.
- Scene switch: a typed `preload("uid://...")` const, then `get_tree().change_scene_to_packed(...)`. Never `change_scene_to_file`.
- Damage goes through one `take_damage` method on the target.

Stubs:
- A body you have not written is `pass` plus a `# TODO:` line that states the intent.

## 8. Comments

- Comment the why, not the what.
- Put a usage block at the top of an autoload or reusable component.
- Delete template comments (`# Called when the node enters the scene tree...`, `# Replace with function body.`).
- Keep comments to one line per fact.

## 9. Checklist for a new scene or script

1. Scene root type matches script `extends`.
2. Nodes renamed from Godot defaults. Names snake_case with suffix.
3. Every var, const, param, and return typed. No unused params or signals.
4. Node lookup: `@onready var x: Type = %name` for named nodes; `$child` for direct children only.
5. No hard-coded keys, hex colors, or scene paths.
6. Cross-scene events go through the correct autoload signal.
7. Empty lifecycle stubs deleted; unwritten bodies marked `# TODO:`.
8. Opens with no errors in the Godot Output panel.

## 10. Collision layers

Set in the scene file, never in code. Layer = what a body is. Mask = what it collides with or detects. Name each layer in Project Settings > Layer Names > 3D Physics.

| # | Layer | Value | Holds |
|---|---|---|---|

New actor or prop: pick a layer from the table first, add a row if it is new.

## 11. Git commit message guide

### Types
- Changes relevant to the API or UI:
    - `feat` Commits that add, adjust or remove a feature to/of/from the API or UI
    - `fix` Commits that fix an API or UI bug of a preceded `feat` commit
- `refactor` Commits that rewrite or restructure code without altering API or UI behavior
    - `perf` Commits are special type of `refactor` commits that specifically improve performance
- `style` Commits that address code style (e.g., white-space, formatting, missing semi-colons) and do not affect application behavior
- `test` Commits that add missing tests or correct existing ones
- `docs` Commits that exclusively affect documentation
- `build` Commits that affect build-related components such as build tools, dependencies, project version, ...
- `ops` Commits that affect operational aspects like infrastructure (IaC), deployment scripts, CI/CD pipelines, backups, monitoring, or recovery procedures, ...
- `chore` Commits that represent tasks like initial commit, modifying `.gitignore`, ...

### Scopes
The `scope` provides additional contextual information.
* The scope is an **optional** part
* Allowed scopes vary and are typically defined by the specific project
* **Do not** use issue identifiers as scopes

### Breaking Changes Indicator
- A commit that introduce breaking changes **must** be indicated by an `!` before the `:` in the subject line e.g. `feat(api)!: remove status endpoint`
- Breaking changes **should** be described in the [commit footer section](#footer), if the [commit description](#description) isn't sufficiently informative

### Description
The `description` contains a concise description of the change. 
- The description is a **mandatory** part
- Use the imperative, present tense: "change" not "changed" nor "changes"
  - Think of `This commit will...` or `This commit should...`
- **Do not** capitalize the first letter
- **Do not** end the description with a period (`.`)
- In case of breaking changes also see [breaking changes indicator](#breaking-changes-indicator)

### Body
The `body` should include the motivation for the change and contrast this with previous behavior.
- The body is an **optional** part
- Use the imperative, present tense: "change" not "changed" nor "changes"

### Footer
The `footer` should contain issue references and informations about **Breaking Changes**
- The footer is an **optional** part, except if the commit introduce breaking changes
- *Optionally* reference issue identifiers (e.g., `Closes #123`, `Fixes JIRA-456`) 
- **Breaking Changes** **must** start with the word `BREAKING CHANGE:`
  - For a single line description just add a space after `BREAKING CHANGE:`
  - For a multi line description add two new lines after `BREAKING CHANGE:`

### Versioning
- **If** your next release contains commit with...
   - **Breaking Changes** incremented the **major version**
   - **API relevant changes** (`feat` or `fix`) incremented the **minor version**
- **Else** increment the **patch version**


### Examples
- ```
  feat: add email notifications on new direct messages
  ```
- ```
  feat(shopping cart): add the amazing button
  ```
- ```
  feat!: remove ticket list endpoint

  refers to JIRA-1337

  BREAKING CHANGE: ticket endpoints no longer supports list all entities.
  ```
- ```
  fix(shopping-cart): prevent order an empty shopping cart
  ```
- ```
  fix(api): fix wrong calculation of request body checksum
  ```
- ```
  fix: add missing parameter to service call

  The error occurred due to <reasons>.
  ```
- ```
  perf: decrease memory footprint for determine unique visitors by using HyperLogLog
  ```
- ```
  build: update dependencies
  ```
- ```
  build(release): bump version to 1.0.0
  ```
- ```
  refactor: implement fibonacci number calculation as recursion
  ```
- ```
  style: remove empty line
  ```
