# Implementation Plan: Game Visual and Gameplay Enhancements

**Branch**: `002-game-visual-and` | **Date**: 2025-11-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-game-visual-and/spec.md`

## Summary

Enhance game visuals and gameplay through 20% sprite scaling, new frog enemy AI, environmental graphics (animated grass/water/parallax clouds), doubled level length with moving platforms, bird egg projectile redesign, and reorganized HUD layout. All changes must maintain 60 fps performance and hand-drawn aesthetic consistency while extending gameplay from 4-6 minutes to 8-10 minutes.

## Technical Context

**Language/Version**: TypeScript 5.3 (ES2020 target)  
**Primary Dependencies**: Phaser 3.70.0 (game engine), Vite 5.0 (build tool), Vitest 1.0 (unit testing), Playwright 1.56 (E2E testing)  
**Storage**: Static JSON files for level data (`public/assets/level-data/`), no backend database  
**Testing**: Vitest for unit tests, Playwright for E2E visual regression tests, manual playtesting for performance verification  
**Target Platform**: Desktop browsers (Chrome latest), 1920×1080 resolution (minimum 1366×768), keyboard-only controls  
**Project Type**: Single web application with game engine, entity classes, scene management, and asset loading  
**Performance Goals**: Sustained 60 fps during gameplay, <3 second initial load time, <2MB compressed bundle size  
**Constraints**: <16ms frame time budget, deterministic physics/collision, static asset hosting only, hand-drawn visual aesthetic  
**Scale/Scope**: Single-level platformer game, ~8-10 minute completion time, 13 entity types (player + 12 others), 4 checkpoints, 43 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Smooth Gameplay & Responsive Controls
- [x] Performance budget defined: 60 fps target verified as feasible - sprite scaling and parallax rendering planned within 16ms frame budget
- [x] Input handling path analysed: keyboard controls remain <16ms latency - no changes to input processing
- [x] Physics/collision determinism maintained: scaled hitboxes use proportional integer scaling, no new floating-point drift
- [x] Frame rate testing plan identified: Playwright E2E tests will measure frame timing, manual testing on target hardware required

### Hand-Drawn Visual Polish & Consistency
- [x] Art asset requirements documented: new frog enemy sprites (stationary/jumping), scaled versions of all existing sprites at 120%, grass/water/cloud graphics, bird egg sprites
- [x] Animation frame counts and timing specified: frog (2 states), grass waving (continuous), water waves (continuous), existing animations maintained at current frame counts
- [x] Visual style guide referenced: hand-drawn colouring-in aesthetic preserved for all new graphics (grass, water, clouds, frog, eggs)
- [x] No placeholder art in deliverable: all asset requirements documented in research.md, integration points defined in contracts/

### Kid-Friendly Playability & Clear Feedback
- [x] Mechanic simplicity verified for 7-8 year old comprehension: new frog enemy uses existing stomp/shoot mechanics, no new controls required
- [x] Visual/audio feedback specified: existing audio system covers frog defeat, new audio requirements documented (frog jump, egg impact)
- [x] Difficulty progression and checkpoint placement reviewed: 4 checkpoints across extended level maintains fair spacing, frog AI designed to be predictable
- [x] Playtest plan with target age group outlined: manual playtesting required post-implementation to verify 8-10 minute completion remains achievable for target age

**GATE STATUS**: ✅ PASSED - All constitution requirements satisfied, no violations requiring justification

## Project Structure

### Documentation (this feature)

```
specs/002-game-visual-and/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── entity-contracts.md      # Entity class interfaces and behavior contracts
│   ├── scene-contracts.md       # Scene lifecycle and state management contracts
│   └── manager-contracts.md     # Manager system contracts (Animation, HUD, etc.)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── main.ts                      # Game entry point
├── config/
│   ├── constants.ts             # Updated with new frog enemy, scaling, animation constants
│   └── phaser-config.ts         # Game configuration (unchanged)
├── entities/
│   ├── Player.ts                # Updated: 120% scale, hitbox scaling
│   ├── EnemyBird.ts             # Updated: egg projectile instead of dropping, 120% scale
│   ├── EnemyShark.ts            # Updated: 120% scale, hitbox scaling
│   ├── EnemyFrog.ts             # NEW: Ground-level jumping enemy with edge detection
│   ├── Boss.ts                  # Updated: 120% scale (minor update)
│   ├── BossProjectile.ts        # Updated: 120% scale
│   ├── EnemyProjectile.ts       # Updated: egg variant, 150% scale
│   ├── PlayerProjectile.ts      # Updated: 120% scale
│   ├── Platform.ts              # Updated: 120% scale, moving platform logic
│   ├── Coin.ts                  # Updated: 120% scale
│   ├── PowerUpWizardHat.ts      # Updated: 120% scale
│   ├── Checkpoint.ts            # Updated: 120% scale
│   ├── GrassLayer.ts            # NEW: Animated grass rendering
│   ├── WaterHazard.ts           # NEW: Animated water in pits
│   └── CloudLayer.ts            # NEW: Parallax cloud background
├── managers/
│   ├── HUDManager.ts            # Updated: repositioned elements, 120% scale, time format
│   ├── GameStateManager.ts      # Updated: enemy respawn tracking logic
│   ├── AnimationManager.ts      # Updated: new frog animations, grass/water/cloud animations
│   ├── InputManager.ts          # Unchanged
│   └── AudioManager.ts          # Updated: new SFX for frog jump, egg impact
├── scenes/
│   ├── GameScene.ts             # Major updates: level extension, entity spawning, layer management
│   ├── PreloadScene.ts          # Updated: load new assets (frog, grass, water, clouds, eggs)
│   ├── BootScene.ts             # Unchanged
│   ├── MainMenuScene.ts         # Updated: 120% scale for UI elements
│   ├── AboutScene.ts            # Updated: 120% scale for UI elements
│   ├── PauseScene.ts            # Updated: 120% scale for UI elements
│   ├── VictoryScene.ts          # Updated: 120% scale for UI elements
│   └── GameOverScene.ts         # Updated: 120% scale for UI elements
├── types/
│   ├── entities.ts              # Updated: new entity types, scaled dimensions
│   ├── managers.ts              # Updated: animation keys for new entities
│   └── scenes.ts                # Unchanged
└── factories/
    └── EntityFactory.ts         # Updated: frog enemy creation, scaled entity instantiation

public/assets/
├── level-data/
│   └── level1.json              # Updated: extended level layout, 4 checkpoints, moving platforms, 3 wizard hats
├── sprites/
│   ├── hugo-120.png             # NEW: 120% scaled player sprite sheet
│   ├── enemies-120.png          # NEW: 120% scaled enemies + new frog sprites
│   ├── boss-120.png             # NEW: 120% scaled boss sprite sheet
│   ├── platforms-120.png        # NEW: 120% scaled platforms sprite sheet
│   ├── collectibles-120.png     # NEW: 120% scaled collectibles sprite sheet
│   ├── ui-120.png               # NEW: 120% scaled UI elements sprite sheet
│   ├── grass-layer.png          # NEW: 30px grass tile/animation frames
│   ├── water-animation.png      # NEW: Water wave animation frames
│   ├── clouds.png               # NEW: Cloud sprite for parallax background
│   └── bird-egg.png             # NEW: Cream-colored oval egg projectile
├── backgrounds/
│   └── forest-bg.png            # Unchanged (or updated if cloud layer integrated here)
├── audio/
│   ├── sfx/
│   │   ├── frog-jump.ogg        # NEW: Frog jump sound
│   │   ├── frog-defeat.ogg      # NEW: Frog defeat sound
│   │   └── egg-impact.ogg       # NEW: Egg hitting ground sound
│   └── music/
│       └── (unchanged)
└── ui/
    └── (120% scaled versions if needed)

tests/
├── unit/
│   ├── entities/
│   │   ├── EnemyFrog.test.ts    # NEW: Frog AI behavior, edge detection, jump timing
│   │   ├── Player.test.ts       # Updated: verify 120% scale and hitbox
│   │   ├── Platform.test.ts     # Updated: moving platform logic
│   │   └── GrassLayer.test.ts   # NEW: Grass animation rendering
│   └── managers/
│       ├── HUDManager.test.ts   # Updated: layout positions, scale verification
│       └── GameStateManager.test.ts  # Updated: enemy respawn logic
├── integration/
│   └── scenes/
│       └── GameScene.test.ts    # Updated: level loading, entity spawning, layer coordination
└── e2e/
    └── game-visual.spec.ts      # Updated: visual regression tests for scaled sprites, new entities, HUD layout

playwright.config.ts             # Unchanged
vite.config.ts                   # Unchanged
tsconfig.json                    # Unchanged
package.json                     # Unchanged (dependencies already sufficient)
```

**Structure Decision**: Single web application structure maintained. All game code in `src/` organized by architectural layer (entities, managers, scenes, factories). Static assets in `public/assets/` organized by type. Tests mirror source structure. This feature primarily updates existing files and adds new entity classes (Frog, GrassLayer, WaterHazard, CloudLayer) plus new scaled sprite assets.

## Complexity Tracking

*No violations of constitution - table not required*

All requirements align with established constitution principles:
- 60 fps performance maintained through optimized sprite scaling and parallax rendering
- Hand-drawn aesthetic preserved through consistent art asset requirements
- Static asset structure unchanged (JSON level data, sprite sheets, audio files)
- Kid-friendly gameplay enhanced through predictable frog AI and extended but fair level design
- No additional projects, repositories, or architectural patterns introduced
