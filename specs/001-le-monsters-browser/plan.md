# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Le Monsters** is a browser-based 2D platformer game featuring Hugo (an orange labubu-like character) navigating through a single side-scrolling level with enemies, collectibles, and a final boss battle. Built with Phaser 3 game engine, Vite build tool, and TypeScript for type safety. The game targets 60fps performance on desktop browsers with hand-drawn art style appealing to ages 7-8. Players have 3 lives to complete the level, collecting coins and power-ups while avoiding enemies and hazards, culminating in a pattern-based boss fight requiring the wizard staff power-up.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)  
**Primary Dependencies**: Phaser 3.70+ (game engine), Vite 5.x (build tool with HMR)  
**Storage**: LocalStorage API (client-side persistence for high scores and settings)  
**Testing**: Vitest (unit tests), Playwright (E2E tests)  
**Target Platform**: Desktop browsers (Chrome, Firefox, Safari, Edge - last 2 versions)  
**Project Type**: web (single-page application, client-side only)  
**Performance Goals**: 60 fps sustained during active gameplay, <3s initial load time on 5+ Mbps broadband  
**Constraints**: <2MB total bundle size compressed, <16ms input latency, no backend/API calls, runs entirely client-side  
**Scale/Scope**: Single level, 4-6 minute completion time, ~10 entity types, ~50 game objects on screen simultaneously

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Smooth Gameplay & Responsive Controls
- [x] Performance budget defined: 60 fps target verified as feasible with Phaser 3 Arcade Physics and object pooling
- [x] Input handling path analysed: Phaser keyboard input system provides <16ms latency via requestAnimationFrame
- [x] Physics/collision determinism maintained: Arcade Physics uses fixed timestep (no random timing or floating-point drift)
- [x] Frame rate testing plan identified: FPS counter in dev mode, Playwright performance profiling on target hardware

### Static Asset Efficiency & Fast Loading
- [x] Total bundle budget: <2MB compressed (Phaser 3.70 minified ~1MB, remaining 1MB for assets)
- [x] Asset optimization strategy: Sprite sheets via TexturePacker, OGG audio compression, JSON level data
- [x] Load time verification: Vite build with code splitting, asset fingerprinting, Brotli compression on GitHub Pages
- [x] Initial load target: <3s from page request to playable menu on 5+ Mbps connection

### Hand-Drawn Visual Polish & Consistency
- [x] Art asset requirements documented: Hugo sprite sheet (5 animations), 2 enemy types, boss, collectibles, backgrounds
- [x] Animation frame counts and timing specified: 12fps run cycle (8 frames), 10fps jump (4 frames), etc. per data-model.md
- [x] Visual style guide referenced: Hand-drawn colouring-in aesthetic preserved across all sprites, UI, backgrounds
- [x] No placeholder art in deliverable: Defined integration points in EntityFactory, asset loading in PreloadScene

### Kid-Friendly Playability & Clear Feedback
- [x] Mechanic simplicity verified: Arrow keys + spacebar + Shift (3 inputs total), intuitive for 7-8 year olds
- [x] Visual/audio feedback specified: SFX for all actions (jump, collect, shoot, damage), particle effects on coin collection
- [x] Difficulty progression reviewed: 4 checkpoints, 3 lives, forgiving coyote time and input buffering per InputManager contract
- [x] Playtest plan outlined: Test user scenarios from spec with target age group or proxy testers

**GATE STATUS**: ✅ PASSED - All constitution principles verified. No violations. Proceed to Phase 1 design.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── main.ts                    # Game entry point (Phaser initialization)
├── config/
│   ├── constants.ts           # Game constants (speeds, physics values)
│   └── phaser-config.ts       # Phaser game configuration
├── scenes/
│   ├── BootScene.ts           # Initial boot and setup
│   ├── PreloadScene.ts        # Asset loading with progress bar
│   ├── MainMenuScene.ts       # Main menu UI
│   ├── AboutScene.ts          # About/credits screen
│   ├── GameScene.ts           # Core gameplay loop
│   ├── PauseScene.ts          # Pause menu overlay
│   ├── VictoryScene.ts        # Victory screen
│   └── GameOverScene.ts       # Game over screen
├── entities/
│   ├── Player.ts              # Hugo (player character)
│   ├── EnemyBird.ts           # Flying bird enemy
│   ├── EnemyShark.ts          # Hovering shark enemy
│   ├── Boss.ts                # Final boss
│   ├── Checkpoint.ts          # Auto-save checkpoint
│   ├── Coin.ts                # Collectible coin
│   ├── PowerUpWizardHat.ts    # Wizard hat power-up
│   ├── Platform.ts            # Static platform
│   ├── MovingPlatform.ts      # Moving platform
│   └── projectiles/
│       ├── PlayerProjectile.ts
│       ├── EnemyProjectile.ts
│       └── BossProjectile.ts
├── managers/
│   ├── InputManager.ts        # Keyboard input handling
│   ├── AudioManager.ts        # Music and SFX
│   ├── GameStateManager.ts    # Session state
│   ├── SaveDataManager.ts     # LocalStorage persistence
│   ├── LevelDataManager.ts    # Level JSON loading
│   ├── HUDManager.ts          # Heads-up display
│   ├── CollisionManager.ts    # Collision setup
│   ├── AnimationManager.ts    # Animation registration
│   └── CameraManager.ts       # Camera control
├── factories/
│   └── EntityFactory.ts       # Entity creation and pooling
└── types/
    ├── entities.ts            # Entity interfaces
    ├── scenes.ts              # Scene interfaces
    └── managers.ts            # Manager interfaces

public/
└── assets/
    ├── sprites/               # Sprite sheets (PNG)
    ├── backgrounds/           # Background images
    ├── audio/
    │   ├── music/            # OGG music files
    │   └── sfx/              # OGG sound effects
    └── level-data/
        └── level1.json       # Level configuration

tests/
├── unit/                     # Vitest unit tests
│   ├── entities/
│   ├── managers/
│   └── utils/
├── integration/              # Vitest integration tests
│   └── scenes/
└── e2e/                      # Playwright E2E tests
    ├── gameplay.spec.ts
    ├── menus.spec.ts
    └── boss-battle.spec.ts
```

**Structure Decision**: Web application (single-page) structure selected. Browser-based game runs entirely client-side with static asset hosting. Phaser 3 uses scene-based architecture (similar to MVC) with clear separation: scenes for UI/gameplay flow, entities for game objects, managers for cross-cutting concerns. Asset files in /public served statically by Vite. TypeScript provides strong typing across all modules. Testing split by granularity: unit tests for logic, integration tests for scene interactions, E2E tests for user scenarios.

## Complexity Tracking

*No constitution violations detected. This section is empty as no justifications are required.*
