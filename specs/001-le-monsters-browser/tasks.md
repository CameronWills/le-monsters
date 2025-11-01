# Tasks: Le Monsters Browser Game

**Feature**: 001-le-monsters-browser  
**Input**: Design documents from `/specs/001-le-monsters-browser/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT explicitly requested in the feature specification. Task list focuses on implementation only. Add test tasks later if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- File paths follow structure from plan.md (web app, client-side only)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure: src/, public/assets/, tests/, with subdirectories per plan.md
- [ ] T002 Initialize package.json with dependencies: phaser@3.70+, vite@5.x, typescript@5.x, vitest, @playwright/test
- [ ] T003 [P] Create vite.config.ts with Phaser build configuration, code splitting, base path './'
- [ ] T004 [P] Create tsconfig.json with strict mode, ES2020 target, DOM lib, path aliases (@/, @assets/)
- [ ] T005 [P] Setup .eslintrc.json and .prettierrc for TypeScript code quality
- [ ] T006 [P] Create index.html entry point loading src/main.ts
- [ ] T007 [P] Create .gitignore for node_modules/, dist/, .vite/, coverage/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create src/config/constants.ts with GAME_CONFIG (speeds, physics, durations from data-model.md)
- [ ] T009 [P] Create TypeScript interfaces in src/types/entities.ts (IEntity, IPlayer, IEnemy, etc. from entity-contracts.md)
- [ ] T010 [P] Create TypeScript interfaces in src/types/scenes.ts (IGameScene, scene lifecycle from scene-contracts.md)
- [ ] T011 [P] Create TypeScript interfaces in src/types/managers.ts (manager contracts from manager-contracts.md)
- [ ] T012 Create src/config/phaser-config.ts with Phaser.Types.Core.GameConfig (1920x1080, Arcade Physics, gravity 800)
- [ ] T013 Create src/main.ts with Phaser.Game initialization using phaser-config.ts
- [ ] T014 Create src/scenes/BootScene.ts implementing IBootScene (minimal scene setup, transition to Preload)
- [ ] T015 Create src/managers/AnimationManager.ts implementing IAnimationManager (empty registerAllAnimations stub)
- [ ] T016 Create src/factories/EntityFactory.ts implementing IEntityFactory (empty factory methods, object pools setup)

**Checkpoint**: Foundation ready - Phaser game boots to black screen, console shows no errors

---

## Phase 3: User Story 1 - Core Gameplay Loop (Priority: P1) 🎯 MVP

**Goal**: Player can load game, start new game, move Hugo with keyboard, jump, collect coins, reach checkpoints, die in pits, respawn with lives

**Independent Test**: Load game → start new game → move Hugo with arrow keys/spacebar → collect coins → reach checkpoint → fall in pit → respawn at checkpoint

### Implementation for User Story 1

#### Asset Loading & Preloader

- [ ] T017 [P] [US1] Create placeholder sprite sheets in public/assets/sprites/: hugo.png (64x64 frames), coins.png, checkpoints.png
- [ ] T018 [P] [US1] Create placeholder background in public/assets/backgrounds/forest-bg.png
- [ ] T019 [P] [US1] Create placeholder audio files in public/assets/audio/sfx/: jump.ogg, collect-coin.ogg, player-death.ogg
- [ ] T020 [US1] Create public/assets/level-data/level1.json with basic level layout (platforms, 2 checkpoints, 5 coins, no enemies)
- [ ] T021 [US1] Implement src/scenes/PreloadScene.ts: load all US1 assets, display progress bar, register Hugo animations (idle, run, jump, fall, death)
- [ ] T022 [US1] Update src/managers/AnimationManager.ts: implement registerPlayerAnimations() for Hugo's 5 animations

#### Core Entities

- [ ] T023 [US1] Implement src/entities/Player.ts (IPlayer interface): physics body, movement, jumping, animation state, lives=3, no shooting yet
- [ ] T024 [US1] Implement src/entities/Platform.ts (IPlatform interface): static physics body, collision box
- [ ] T025 [US1] Implement src/entities/Coin.ts (ICoin interface): overlap detection, collect() method
- [ ] T026 [US1] Implement src/entities/Checkpoint.ts (ICheckpoint interface): overlap detection, activate() flag raise animation

#### Managers

- [ ] T027 [US1] Implement src/managers/InputManager.ts (IInputManager interface): arrow keys, spacebar, jump buffering (5 frames)
- [ ] T028 [US1] Implement src/managers/GameStateManager.ts (IGameStateManager interface): lives, coins, timer, checkpoint tracking
- [ ] T029 [US1] Implement src/managers/LevelDataManager.ts (ILevelDataManager interface): load and parse level1.json
- [ ] T030 [US1] Implement src/managers/HUDManager.ts (IHUDManager interface): display lives, coins, timer (no boss health bar yet)
- [ ] T031 [US1] Implement src/managers/AudioManager.ts (IAudioManager interface): playSFX() for jump, collect, death sounds
- [ ] T032 [US1] Implement src/managers/CameraManager.ts (ICameraManager interface): follow player, set bounds, fade effects

#### Game Scene

- [ ] T033 [US1] Implement src/scenes/GameScene.ts (IGameScene interface): load level, create player at start position, create platforms
- [ ] T034 [US1] Add to GameScene: create coins from level data, setup coin collection collision
- [ ] T035 [US1] Add to GameScene: create checkpoints from level data, setup checkpoint activation collision
- [ ] T036 [US1] Add to GameScene: setup platform collision with player, implement physics
- [ ] T037 [US1] Add to GameScene: implement player update loop (process input, update animation, check out of bounds)
- [ ] T038 [US1] Add to GameScene: implement death sequence (fall in pit → death animation → 2s delay → respawn at checkpoint)
- [ ] T039 [US1] Add to GameScene: implement respawn logic (reset position, decrease lives, 1s invincibility)
- [ ] T040 [US1] Add to GameScene: integrate HUD updates (lives, coins, timer)
- [ ] T041 [US1] Add to GameScene: integrate camera follow player, set level bounds

#### EntityFactory Integration

- [ ] T042 [US1] Update src/factories/EntityFactory.ts: implement createPlayer(), createCoin(), createCheckpoint(), createStaticPlatform()

**Checkpoint**: User Story 1 complete - Full gameplay loop works: move, jump, collect coins, checkpoints, death, respawn, 60fps

---

## Phase 4: User Story 4 - Lives System & Game Over (Priority: P2)

**Goal**: Player starts with 3 lives, loses life on death, sees Game Over screen when lives=0, can return to menu

**Independent Test**: Start game → die 3 times → verify Game Over screen appears with final time → return to menu option works

### Implementation for User Story 4

- [ ] T043 [P] [US4] Create placeholder assets in public/assets/ui/: game-over-bg.png
- [ ] T044 [US4] Implement src/scenes/GameOverScene.ts (IGameOverScene interface): display final time, coins, "Try Again" and "Main Menu" buttons
- [ ] T045 [US4] Update src/scenes/GameScene.ts: when lives reach 0, trigger game over instead of respawn
- [ ] T046 [US4] Update src/managers/GameStateManager.ts: implement endSession() returning ISessionEndData
- [ ] T047 [US4] Update src/entities/Player.ts: ensure invincibility for 1s after respawn (flashing sprite visual)
- [ ] T048 [US4] Update src/managers/HUDManager.ts: add lives icons visual representation (hearts)

**Checkpoint**: User Story 4 complete - Lives system fully functional, game over screen works, respawn invincibility prevents instant re-death

---

## Phase 5: User Story 5 - Menu & UI Systems (Priority: P2)

**Goal**: Player sees main menu on load, can navigate to "New Game" and "About", pause during gameplay, see HUD

**Independent Test**: Load game → main menu appears → click About → back to menu → New Game → pause with ESC → continue/quit options work

### Implementation for User Story 5

#### Assets & Scenes

- [ ] T049 [P] [US5] Create placeholder assets in public/assets/ui/: main-menu-bg.png, about-bg.png, pause-bg.png
- [ ] T050 [US5] Implement src/scenes/MainMenuScene.ts (IMainMenuScene interface): "New Game" and "About" buttons, display best time
- [ ] T051 [US5] Implement src/scenes/AboutScene.ts (IAboutScene interface): display credits, "Back" button
- [ ] T052 [US5] Implement src/scenes/PauseScene.ts (IPauseScene interface): "Continue" and "Main Menu" buttons, confirmation dialog

#### Save Data

- [ ] T053 [US5] Implement src/managers/SaveDataManager.ts (ISaveDataManager interface): LocalStorage read/write, best time tracking
- [ ] T054 [US5] Update src/scenes/MainMenuScene.ts: load save data, display best time if exists
- [ ] T055 [US5] Update src/scenes/GameScene.ts: handle ESC key to launch PauseScene overlay
- [ ] T056 [US5] Update src/scenes/GameScene.ts: implement pause/resume physics and music

#### Scene Flow

- [ ] T057 [US5] Update src/config/phaser-config.ts: add all scenes in correct order (Boot, Preload, MainMenu, About, Game, Pause, GameOver)
- [ ] T058 [US5] Update src/scenes/BootScene.ts: transition to PreloadScene instead of directly to game
- [ ] T059 [US5] Update src/scenes/PreloadScene.ts: transition to MainMenuScene instead of GameScene
- [ ] T060 [US5] Update src/scenes/MainMenuScene.ts: transition to GameScene on "New Game", AboutScene on "About"

**Checkpoint**: User Story 5 complete - Full menu system works, pause/resume functional, save data persists, navigation flows correctly

---

## Phase 6: User Story 2 - Enemy Combat & Power-ups (Priority: P2)

**Goal**: Player encounters enemies (birds, sharks), can stomp them or collect wizard hat to shoot, enemies respawn on death

**Independent Test**: Place Hugo in level with enemies and wizard hat → stomp shark → collect wizard hat → shoot to kill bird → verify death resets power-up

### Implementation for User Story 2

#### Assets

- [ ] T061 [P] [US2] Create placeholder sprite sheets in public/assets/sprites/: enemies.png (bird, shark frames), wizard-hat.png
- [ ] T062 [P] [US2] Create placeholder audio in public/assets/audio/sfx/: enemy-defeat.ogg, collect-powerup.ogg, shoot.ogg

#### Enemy Entities

- [ ] T063 [US2] Implement src/entities/EnemyBird.ts (IEnemyBird interface): fly horizontal, drop projectiles every 2-5s, check bounds
- [ ] T064 [US2] Implement src/entities/EnemyShark.ts (IEnemyShark interface): patrol platform, reverse at boundaries
- [ ] T065 [US2] Implement src/entities/PowerUpWizardHat.ts (IPowerUpWizardHat interface): collectible, respawn on player death
- [ ] T066 [US2] Implement src/entities/projectiles/PlayerProjectile.ts (IPlayerProjectile interface): straight line, 800px max distance
- [ ] T067 [US2] Implement src/entities/projectiles/EnemyProjectile.ts (IEnemyProjectile interface): gravity-affected dropping

#### Player Combat

- [ ] T068 [US2] Update src/entities/Player.ts: add hasWizardHat state, shoot() method with 1s cooldown, shootCooldown timer
- [ ] T069 [US2] Update src/managers/InputManager.ts: add isShootPressed() for Shift key detection
- [ ] T070 [US2] Update src/managers/AnimationManager.ts: register bird and shark animations (fly, swim cycles)

#### Game Scene Integration

- [ ] T071 [US2] Update src/scenes/GameScene.ts: load enemies from level1.json, spawn birds and sharks
- [ ] T072 [US2] Update src/scenes/GameScene.ts: update enemies in game loop (movement, attack patterns)
- [ ] T073 [US2] Update src/scenes/GameScene.ts: setup collision - player stomp on enemy (check player.y < enemy.y and falling)
- [ ] T074 [US2] Update src/scenes/GameScene.ts: setup collision - enemy/projectile hits player → death
- [ ] T075 [US2] Update src/scenes/GameScene.ts: setup collision - player projectile hits enemy → enemy dies
- [ ] T076 [US2] Update src/scenes/GameScene.ts: spawn wizard hat from level data, setup collection collision
- [ ] T077 [US2] Update src/scenes/GameScene.ts: handle player shooting (create projectile when Shift pressed and has hat)
- [ ] T078 [US2] Update src/scenes/GameScene.ts: enemy respawn logic (reset to spawn positions when player respawns)
- [ ] T079 [US2] Update src/scenes/GameScene.ts: wizard hat respawn logic (return to spawn position when player dies)

#### EntityFactory & Object Pooling

- [ ] T080 [US2] Update src/factories/EntityFactory.ts: implement createBird(), createShark(), createWizardHat()
- [ ] T081 [US2] Update src/factories/EntityFactory.ts: implement projectile pooling (50 player, 30 enemy projectiles pre-created)
- [ ] T082 [US2] Update src/factories/EntityFactory.ts: implement createPlayerProjectile() and createEnemyProjectile() with pooling

#### Level Data

- [ ] T083 [US2] Update public/assets/level-data/level1.json: add 3 birds, 2 sharks, 1 wizard hat at appropriate positions

**Checkpoint**: User Story 2 complete - Enemy combat fully functional, stomp and shooting both work, power-up system operational

---

## Phase 7: User Story 3 - Boss Battle (Priority: P3)

**Goal**: Player enters boss arena at level end, fights boss with wizard staff (10 health), defeats boss to win

**Independent Test**: Load Hugo at boss arena entrance with wizard hat → enter arena → boss battle starts → shoot boss 10 times → verify victory screen

### Implementation for User Story 3

#### Assets

- [ ] T084 [P] [US3] Create placeholder sprite sheets in public/assets/sprites/: boss.png (idle, attack, hurt, death animations)
- [ ] T085 [P] [US3] Create placeholder audio in public/assets/audio/music/: boss.ogg, victory.ogg
- [ ] T086 [P] [US3] Create placeholder audio in public/assets/audio/sfx/: boss-hit.ogg, boss-defeat.ogg
- [ ] T087 [P] [US3] Create placeholder assets in public/assets/ui/: victory-bg.png

#### Boss Entity

- [ ] T088 [US3] Implement src/entities/Boss.ts (IBoss interface): 10 health, attack patterns (burst/pause cycle), shoot projectiles
- [ ] T089 [US3] Implement src/entities/projectiles/BossProjectile.ts (IBossProjectile interface): aimed at player position when fired
- [ ] T090 [US3] Update src/managers/AnimationManager.ts: register boss animations (idle, attack, hurt, death)

#### Victory Scene

- [ ] T091 [US3] Implement src/scenes/VictoryScene.ts (IVictoryScene interface): display final time, coins, best time comparison, save best time

#### Game Scene Boss Integration

- [ ] T092 [US3] Update src/scenes/GameScene.ts: create boss arena boundary detection (checkBossArenaEntry)
- [ ] T093 [US3] Update src/scenes/GameScene.ts: implement startBossBattle() - lighting change, boss music crossfade
- [ ] T094 [US3] Update src/scenes/GameScene.ts: spawn boss at arena position from level data
- [ ] T095 [US3] Update src/scenes/GameScene.ts: update boss in game loop (attack pattern timing, shoot projectiles)
- [ ] T096 [US3] Update src/scenes/GameScene.ts: setup collision - player projectile hits boss → decrease health
- [ ] T097 [US3] Update src/scenes/GameScene.ts: setup collision - boss projectile hits player → death
- [ ] T098 [US3] Update src/scenes/GameScene.ts: implement defeatBoss() - stop music, victory music, transition to VictoryScene
- [ ] T099 [US3] Update src/scenes/GameScene.ts: boss health reset on player respawn

#### HUD & Audio

- [ ] T100 [US3] Update src/managers/HUDManager.ts: implement showBossHealthBar(), updateBossHealth() with visual bar
- [ ] T101 [US3] Update src/managers/AudioManager.ts: implement playMusic() with crossfade, add boss and victory music
- [ ] T102 [US3] Update src/managers/SaveDataManager.ts: implement updateBestTime() for victory screen

#### EntityFactory

- [ ] T103 [US3] Update src/factories/EntityFactory.ts: implement createBoss(), createBossProjectile() with pooling (20 projectiles)

#### Level Data

- [ ] T104 [US3] Update public/assets/level-data/level1.json: add bossArena coordinates and boss position at level end

**Checkpoint**: User Story 3 complete - Boss battle fully functional, victory screen works, best time saves

---

## Phase 8: Moving Platforms (Enhancement to US1)

**Goal**: Add moving platforms with visible path indicators for traversing pits

**Independent Test**: Verify moving platforms follow path, carry player, show path indicators

### Implementation for Moving Platforms

- [ ] T105 [US1] Implement src/entities/MovingPlatform.ts (IMovingPlatform interface): waypoint path, constant speed, path indicators
- [ ] T106 [US1] Update src/scenes/GameScene.ts: create moving platforms from level data, update in game loop
- [ ] T107 [US1] Update src/scenes/GameScene.ts: setup collision - player stands on moving platform (inherits platform velocity)
- [ ] T108 [US1] Update src/factories/EntityFactory.ts: implement createMovingPlatform()
- [ ] T109 [US1] Update public/assets/level-data/level1.json: add 2 moving platforms with paths over pits

**Checkpoint**: Moving platforms operational - player can ride platforms across pits

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

#### Visual Polish

- [ ] T110 [P] Replace placeholder sprite sheets with final hand-drawn art: Hugo, enemies, boss, collectibles, checkpoints
- [ ] T111 [P] Replace placeholder backgrounds with final hand-drawn forest background
- [ ] T112 [P] Replace placeholder UI graphics with final hand-drawn menu screens
- [ ] T113 Add particle effects for coin collection (sparkles)
- [ ] T114 Add camera shake effect on boss hits and player death
- [ ] T115 Add screen flash effect on player damage (white flash)

#### Audio Integration

- [ ] T116 [P] Replace placeholder audio with final SFX: jump, collect, shoot, death, enemy defeat
- [ ] T117 [P] Replace placeholder music with final tracks: gameplay, boss, victory
- [ ] T118 Update src/scenes/PreloadScene.ts: load all final audio assets
- [ ] T119 Update src/managers/AudioManager.ts: add audio sprite for SFX (combine multiple SFX into one file)
- [ ] T120 Update src/scenes/GameScene.ts: add footstep SFX on specific animation frames

#### Performance Optimization

- [ ] T121 Implement object pooling verification: ensure 50+ projectiles reuse pool without GC spikes
- [ ] T122 Add FPS counter in dev mode: display in top-left corner, toggle with F key
- [ ] T123 Profile performance: use Chrome DevTools to verify 60fps sustained during gameplay
- [ ] T124 Optimize sprite sheets: use TexturePacker to create atlases, reduce draw calls
- [ ] T125 Verify bundle size: ensure dist/ output <2MB compressed

#### Testing & Validation

- [ ] T126 Validate quickstart.md: verify all setup steps work on fresh install
- [ ] T127 Test cross-browser compatibility: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] T128 Test all user scenarios from spec.md manually
- [ ] T129 Verify constitution compliance: 60fps, <3s load, <16ms input latency
- [ ] T130 Playtest with target age group (7-8 years) or proxy testers

#### Documentation & Deployment

- [ ] T131 [P] Create README.md: project description, setup instructions, controls, credits
- [ ] T132 [P] Setup GitHub Actions workflow: .github/workflows/deploy.yml for GitHub Pages deployment
- [ ] T133 [P] Setup GitHub Actions workflow: .github/workflows/test.yml for CI (linting, type-check)
- [ ] T134 Add CNAME file for custom domain (if applicable)
- [ ] T135 Run production build: npm run build, verify dist/ output
- [ ] T136 Deploy to GitHub Pages: verify game loads and works on production URL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - **US1 (P1 - Core Gameplay)**: Can start after Foundational - No dependencies on other stories
  - **US4 (P2 - Lives/Game Over)**: Depends on US1 (needs game over trigger) - Can start after US1 complete
  - **US5 (P2 - Menus/UI)**: Can start after Foundational - Integrates with US1 but mostly independent
  - **US2 (P2 - Combat)**: Depends on US1 (needs player movement) - Can start after US1 complete
  - **US3 (P3 - Boss)**: Depends on US2 (needs wizard staff) - Can start after US2 complete
  - **Moving Platforms (Phase 8)**: Enhances US1 - Can add anytime after US1 complete
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Foundational (Phase 2) → MUST complete before ANY story
    ↓
US1 (P1) → Core Gameplay [MVP - can deploy here!]
    ↓
    ├─→ US4 (P2) → Lives/Game Over [can run parallel with US5]
    ├─→ US5 (P2) → Menus/UI [can run parallel with US4]
    └─→ US2 (P2) → Combat
            ↓
        US3 (P3) → Boss Battle
            ↓
        Moving Platforms → Enhancement
            ↓
        Polish → Final phase
```

### Parallel Opportunities

- **Phase 1 (Setup)**: Tasks T003, T004, T005, T006, T007 can all run in parallel
- **Phase 2 (Foundational)**: Tasks T009, T010, T011 can run in parallel
- **Phase 3 (US1)**: 
  - T017, T018, T019 (assets) can run in parallel
  - T023, T024, T025, T026 (entities) can run in parallel after T022 complete
- **Phase 4 (US4)**: T043 (asset) can run ahead
- **Phase 5 (US5)**: T049 (assets) can run ahead
- **Phase 6 (US2)**: T061, T062 (assets) can run in parallel
- **Phase 7 (US3)**: T084, T085, T086, T087 (assets) can run in parallel
- **Phase 9 (Polish)**: T110, T111, T112 (art), T116, T117 (audio), T131, T132, T133 (docs) can run in parallel

---

## Parallel Example: User Story 1 (Core Gameplay)

```bash
# First, launch all asset creation in parallel:
Task T017: "Create hugo.png sprite sheet"
Task T018: "Create forest-bg.png"
Task T019: "Create SFX files (jump, collect, death)"

# Then launch entity implementations in parallel:
Task T023: "Implement Player.ts"
Task T024: "Implement Platform.ts"
Task T025: "Implement Coin.ts"
Task T026: "Implement Checkpoint.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended!

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T016) - **CRITICAL GATE**
3. Complete Phase 3: User Story 1 (T017-T042)
4. **STOP and VALIDATE**: Test US1 independently - full gameplay loop works
5. Deploy/demo MVP to GitHub Pages
6. Collect feedback before continuing

**MVP Deliverable**: Playable game with movement, jumping, coins, checkpoints, death/respawn, HUD, timer - **immediately fun!**

### Incremental Delivery (Add Features After MVP)

1. MVP deployed ✅
2. Add Phase 4: US4 - Lives/Game Over (T043-T048)
3. Add Phase 5: US5 - Menus/UI (T049-T060)
4. Add Phase 6: US2 - Combat (T061-T083)
5. Add Phase 7: US3 - Boss (T084-T104)
6. Add Phase 8: Moving Platforms (T105-T109)
7. Add Phase 9: Polish (T110-T136)

Each phase adds value without breaking previous stories - **continuous delivery!**

### Parallel Team Strategy

With 2-3 developers after Foundational phase complete:

**Sprint 1**: MVP
- All devs: Complete US1 together (T017-T042)
- Deploy MVP

**Sprint 2**: Core Features
- Developer A: US4 (Lives/Game Over)
- Developer B: US5 (Menus/UI)
- Both can work in parallel - minimal conflicts

**Sprint 3**: Combat & Boss
- Developer A: US2 (Combat)
- Developer B: Polish visual assets
- Sequential: US2 → US3 (Boss depends on wizard staff)

**Sprint 4**: Final Polish
- All devs: Phase 9 (polish tasks in parallel)
- Deploy final version

---

## Task Count Summary

- **Setup**: 7 tasks (T001-T007)
- **Foundational**: 9 tasks (T008-T016)
- **US1 - Core Gameplay**: 26 tasks (T017-T042)
- **US4 - Lives/Game Over**: 6 tasks (T043-T048)
- **US5 - Menus/UI**: 12 tasks (T049-T060)
- **US2 - Combat**: 23 tasks (T061-T083)
- **US3 - Boss**: 21 tasks (T084-T104)
- **Moving Platforms**: 5 tasks (T105-T109)
- **Polish**: 27 tasks (T110-T136)

**Total**: 136 tasks

**Parallel opportunities**: ~40 tasks marked [P] can run simultaneously

**Suggested MVP scope**: Phases 1-3 (42 tasks) = Immediately playable game!

---

## Notes

- [P] tasks = different files, can run in parallel
- [Story] label maps task to specific user story (US1-US5) for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Tests not included**: Feature spec doesn't explicitly request TDD. Add test tasks later if needed.
- **Placeholder assets first**: Use simple colored rectangles initially, replace in Phase 9 (Polish)
- **Performance critical**: Monitor FPS throughout, use object pooling, optimize in Phase 9
- **Constitution compliance**: Verify 60fps, <3s load, <16ms input, hand-drawn art style in final build
