# Tasks: Game Visual and Gameplay Enhancements

**Input**: Design documents from `/specs/002-game-visual-and/`
**Prerequisites**: plan.md, spec.md (user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification. Test tasks are included for critical validation points but can be adjusted based on team preference.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asset preparation and configuration updates for scaled sprites and new entities

- [ ] T001 [P] Create scaled sprite sheets at 120% for player, enemies, boss, platforms, collectibles, UI using nearest-neighbor interpolation
- [ ] T002 [P] Design frog enemy sprite sheet with stationary (2 frames) and jumping (4 frames) animations
- [ ] T003 [P] Create grass animation sprite sheet (30px height, 4-6 waving frames)
- [ ] T004 [P] Create water animation sprite sheet (wave motion, 4-8 frames)
- [ ] T005 [P] Create cloud sprite for parallax background (seamless tile)
- [ ] T006 [P] Create bird egg sprite (oval, cream-colored, 1.5x original dropping size)
- [ ] T007 [P] Record audio files: frog-jump.ogg, frog-defeat.ogg, egg-impact.ogg
- [ ] T008 Update `src/config/constants.ts` with new constants (SPRITE_SCALE: 1.2, EGG_SCALE: 1.5, FROG_JUMP_INTERVAL: 2000, FROG_JUMP_SPEED, FROG_JUMP_HEIGHT, FROG_EDGE_CHECK_DISTANCE, GRASS_HEIGHT: 30, CLOUD_SCROLL_FACTOR: 0.5)
- [ ] T009 [P] Add new animation keys to `src/config/constants.ts` (ANIM_KEYS.ENEMIES.FROG_STATIONARY, FROG_JUMPING, ANIM_KEYS.ENVIRONMENTAL.GRASS_WAVE, WATER_WAVE)
- [ ] T010 [P] Add new sprite keys to `src/config/constants.ts` (SPRITE_KEYS.FROG, GRASS, WATER, CLOUDS, BIRD_EGG)
- [ ] T011 [P] Add new audio keys to `src/config/constants.ts` (AUDIO_KEYS.SFX.FROG_JUMP, FROG_DEFEAT, EGG_IMPACT)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core systems that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Update `src/scenes/PreloadScene.ts` to load all scaled sprite sheets (120% versions or maintain original keys with runtime scaling)
- [ ] T013 Update `src/scenes/PreloadScene.ts` to load frog enemy sprite sheet
- [ ] T014 [P] Update `src/scenes/PreloadScene.ts` to load grass-layer sprite sheet
- [ ] T015 [P] Update `src/scenes/PreloadScene.ts` to load water-animation sprite sheet
- [ ] T016 [P] Update `src/scenes/PreloadScene.ts` to load clouds sprite/tile
- [ ] T017 [P] Update `src/scenes/PreloadScene.ts` to load bird-egg sprite sheet
- [ ] T018 [P] Update `src/scenes/PreloadScene.ts` to load new audio files (frog-jump.ogg, frog-defeat.ogg, egg-impact.ogg)
- [ ] T019 Update `src/managers/AnimationManager.ts` with `createFrogAnimations()` method (frog-stationary: 4fps loop, frog-jumping: 10fps no-loop)
- [ ] T020 [P] Update `src/managers/AnimationManager.ts` with `createEnvironmentalAnimations()` method (grass-wave: 6fps loop yoyo, water-wave: 8fps loop)
- [ ] T021 [P] Update `src/managers/AnimationManager.ts` with `createEggAnimation()` method (bird-egg-fall: 10fps loop)
- [ ] T022 Update `src/managers/GameStateManager.ts` to add `defeatedEnemies: Set<string>` property and methods (`addDefeatedEnemy()`, `isEnemyDefeated()`, `clearDefeatedEnemies()`)
- [ ] T023 Update `src/managers/GameStateManager.ts` to add `collectedItems: Set<string>` property and methods (`addCollectedItem()`, `isItemCollected()`, `clearCollectedItems()`)
- [ ] T024 Update `src/managers/GameStateManager.ts` to enforce `incrementCoins(amount: 1)` contract (MUST only accept amount === 1, throw error otherwise)
- [ ] T025 [P] Update `src/managers/AudioManager.ts` to add new SFX playback methods for frog-jump, frog-defeat, egg-impact

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enhanced Visual Experience (Priority: P1) 🎯 MVP

**Goal**: Scale all sprites to 120%, add animated grass on ground surfaces, water in pits, and parallax clouds in background

**Independent Test**: Launch game and verify all sprites are 20% larger, grass appears on ground with animation, water appears in pits with animation, clouds move at half camera speed

### Implementation for User Story 1

- [ ] T026 [P] [US1] Update `src/entities/Player.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T027 [P] [US1] Update `src/entities/EnemyBird.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T028 [P] [US1] Update `src/entities/EnemyShark.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T029 [P] [US1] Update `src/entities/Boss.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)`
- [ ] T030 [P] [US1] Update `src/entities/Platform.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T031 [P] [US1] Update `src/entities/Coin.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T032 [P] [US1] Update `src/entities/PowerUpWizardHat.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T033 [P] [US1] Update `src/entities/Checkpoint.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)` and verify hitbox scales proportionally
- [ ] T034 [P] [US1] Update `src/entities/PlayerProjectile.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)`
- [ ] T035 [P] [US1] Update `src/entities/BossProjectile.ts` to apply `setScale(GAME_CONFIG.SPRITE_SCALE)`
- [ ] T036 [US1] Create `src/entities/GrassLayer.ts` class (TileSprite, 30px height, depth 5, plays grass-wave animation on loop)
- [ ] T037 [US1] Create `src/entities/WaterHazard.ts` class (sprite covering pit area, ocean blue tint #0077BE, depth 1, plays water-wave animation on loop)
- [ ] T038 [US1] Create `src/entities/CloudLayer.ts` class (TileSprite, depth 0, scrollFactor 0.5, positioned in sky region)
- [ ] T039 [US1] Update `src/scenes/GameScene.ts` to add `setupEnvironmentalLayers()` method that creates cloud layer, water hazards in pits, grass layers on ground surfaces
- [ ] T040 [US1] Update `src/scenes/GameScene.ts` update loop to update cloud parallax: `cloudLayer.tilePositionX = camera.scrollX * 0.5`
- [ ] T041 [US1] Update `src/types/entities.ts` to add GrassLayer, WaterHazard, CloudLayer type definitions

### Testing for User Story 1

- [ ] T042 [P] [US1] Manual test: Verify all sprites visually 20% larger than original using pixel measurements
- [ ] T043 [P] [US1] Manual test: Verify grass animation plays continuously on ground surfaces with waving motion
- [ ] T044 [P] [US1] Manual test: Verify water animation plays continuously in pits with wave motion
- [ ] T045 [P] [US1] Manual test: Verify clouds move at 50% camera speed (parallax effect visible)
- [ ] T046 [P] [US1] Manual test: Verify collision detection works correctly with scaled hitboxes (jump on platforms, collect coins, enemy hits)
- [ ] T047 [P] [US1] E2E test in `tests/e2e/game-visual.spec.ts`: Visual regression test comparing scaled sprites to expected baseline
- [ ] T048 [P] [US1] Unit test in `tests/unit/entities/GrassLayer.test.ts`: Verify grass height is exactly 30px and animation plays
- [ ] T049 [P] [US1] Unit test in `tests/unit/entities/CloudLayer.test.ts`: Verify scrollFactor is exactly 0.5

**Checkpoint**: At this point, User Story 1 should be fully functional - game has larger sprites and environmental graphics

---

## Phase 4: User Story 2 - New Frog Enemy Challenge (Priority: P2)

**Goal**: Introduce green frog enemy that jumps toward player every 2 seconds, stops at platform edges, can be defeated by stomping or shooting

**Independent Test**: Spawn frogs on ground-level platforms, verify they jump toward player every 2 seconds, stop at edges near pits, and can be defeated

### Implementation for User Story 2

- [ ] T050 [US2] Create `src/entities/EnemyFrog.ts` class implementing frog contract (scale 1.2, jumpTimer, jumpInterval 2000ms, state management)
- [ ] T051 [US2] Implement `EnemyFrog.performJump()` method with player detection (compare X positions), edge detection (raycast 20px ahead), and jump velocity application
- [ ] T052 [US2] Implement `EnemyFrog.checkPlatformEdge()` method using raycast or tile map query (20px ahead, 50px downward)
- [ ] T053 [US2] Implement `EnemyFrog.update()` method to increment jumpTimer, trigger jumps every 2 seconds when grounded, handle state transitions (stationary ↔ jumping)
- [ ] T054 [US2] Implement `EnemyFrog.onDefeated()` method to play defeat animation, trigger SFX, add to GameStateManager.defeatedEnemies, destroy after delay
- [ ] T055 [US2] Update `src/factories/EntityFactory.ts` to add `createFrog(x, y)` method for frog enemy instantiation
- [ ] T056 [US2] Update `src/scenes/GameScene.ts` spawnEnemies() to handle 'frog' type, check GameStateManager.isEnemyDefeated() before spawning
- [ ] T057 [US2] Update `src/scenes/GameScene.ts` setupCollisions() to add player stomp collision handler for frogs (calls onDefeated())
- [ ] T058 [US2] Update `src/scenes/GameScene.ts` setupCollisions() to add player projectile collision handler for frogs (calls onDefeated())
- [ ] T059 [US2] Update `src/scenes/GameScene.ts` update loop to call frog.update(time, delta, player) for all frog enemies
- [ ] T060 [US2] Update `src/types/entities.ts` to add EnemyFrog interface definition

### Testing for User Story 2

- [ ] T061 [P] [US2] Unit test in `tests/unit/entities/EnemyFrog.test.ts`: Verify jump timing is exactly 2000ms intervals
- [ ] T062 [P] [US2] Unit test in `tests/unit/entities/EnemyFrog.test.ts`: Verify detectPlayer() returns correct direction (left/right)
- [ ] T063 [P] [US2] Unit test in `tests/unit/entities/EnemyFrog.test.ts`: Verify checkPlatformEdge() stops frog at edges
- [ ] T064 [P] [US2] Unit test in `tests/unit/entities/EnemyFrog.test.ts`: Verify state transitions (stationary → jumping → stationary)
- [ ] T065 [P] [US2] Unit test in `tests/unit/entities/EnemyFrog.test.ts`: Verify onDefeated() adds to GameStateManager.defeatedEnemies
- [ ] T066 [P] [US2] Integration test in `tests/integration/scenes/GameScene.test.ts`: Verify frog respawns after player death
- [ ] T067 [P] [US2] Integration test in `tests/integration/scenes/GameScene.test.ts`: Verify defeated frogs don't respawn during continuous play
- [ ] T068 [P] [US2] Manual test: Verify frog jumps toward player every 2 seconds (use timer)
- [ ] T069 [P] [US2] Manual test: Verify frog stops at platform edges (doesn't fall into pits)
- [ ] T070 [P] [US2] Manual test: Verify frog can be defeated by stomping on head
- [ ] T071 [P] [US2] Manual test: Verify frog can be defeated by wizard staff projectile
- [ ] T072 [P] [US2] E2E test in `tests/e2e/game-visual.spec.ts`: Verify frog enemy visual appearance and behavior

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - game has visual enhancements AND new frog enemy

---

## Phase 5: User Story 3 - Extended Level Length (Priority: P2)

**Goal**: Double level length with more platforms, pits, enemies, 4 checkpoints, 3 wizard hats (last after final checkpoint), and moving platforms

**Independent Test**: Play through entire level and verify 8-10 minute completion time, 4 checkpoints distributed evenly, moving platforms (vertical and horizontal), approximately double the content

### Implementation for User Story 3

- [ ] T073 [US3] Design extended `public/assets/level-data/level1.json` structure with doubled length (~12000px width), 4 checkpoint positions, 3 wizard hat positions
- [ ] T074 [US3] Add approximately 2x platforms to level1.json distributed throughout extended level (include mix of static, moving-vertical, moving-horizontal types)
- [ ] T075 [US3] Add more pits to level1.json with hasWater: true property for water rendering
- [ ] T076 [US3] Add more enemy spawns to level1.json distributed throughout level (birds, sharks, frogs on ground level only)
- [ ] T077 [US3] Add grass layer definitions to level1.json (startX, endX, y coordinates for ground surfaces)
- [ ] T078 [US3] Place 4 checkpoints in level1.json at ~25%, ~50%, ~75%, ~95% of level length
- [ ] T079 [US3] Place 3 wizard hats in level1.json (strategic positions, hat-3 after checkpoint-4 before boss)
- [ ] T080 [US3] Validate level1.json structure: checkpointCount === 4, wizardHatCount === 3, worldBounds.width ~2x original
- [ ] T081 [US3] Update `src/entities/Platform.ts` to add moving platform logic with tween-based oscillation (vertical: tween Y, horizontal: tween X, yoyo: true, repeat: -1, ease: Sine.easeInOut)
- [ ] T082 [US3] Update `src/entities/Platform.ts` to initialize movement tween in create() if platformType is 'moving-vertical' or 'moving-horizontal'
- [ ] T083 [US3] Update `src/factories/EntityFactory.ts` to handle moving platform creation with movement config (distance, speed, axis)
- [ ] T084 [US3] Update `src/scenes/GameScene.ts` loadLevel() to validate level data (checkpoints === 4, wizardHats === 3, last hat after final checkpoint)
- [ ] T085 [US3] Update `src/scenes/GameScene.ts` spawnPlatforms() to handle moving platform types and initialize tweens
- [ ] T086 [US3] Update `src/scenes/GameScene.ts` to update camera world bounds to match extended level dimensions
- [ ] T087 [US3] Update `src/types/entities.ts` to add Platform movement property type definitions

### Testing for User Story 3

- [ ] T088 [P] [US3] Manual test: Play through entire level and time completion (should be 8-10 minutes excluding boss)
- [ ] T089 [P] [US3] Manual test: Verify 4 checkpoints are encountered during normal progression
- [ ] T090 [P] [US3] Manual test: Verify 3 wizard hats can be found and collected
- [ ] T091 [P] [US3] Manual test: Verify last wizard hat is after final checkpoint (before boss fight)
- [ ] T092 [P] [US3] Manual test: Verify moving platforms move smoothly (vertical up/down, horizontal left/right)
- [ ] T093 [P] [US3] Manual test: Verify player can ride moving platforms without falling off
- [ ] T094 [P] [US3] Manual test: Verify approximately 2x more platforms, pits, and enemies compared to original
- [ ] T095 [P] [US3] Unit test in `tests/unit/entities/Platform.test.ts`: Verify moving platform tween initialization with correct parameters
- [ ] T096 [P] [US3] Integration test in `tests/integration/scenes/GameScene.test.ts`: Verify level loads successfully with validation passing
- [ ] T097 [P] [US3] Integration test in `tests/integration/scenes/GameScene.test.ts`: Verify checkpoint spacing is even (25%, 50%, 75%, 95%)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - game has visual enhancements, frog enemy, AND extended level

---

## Phase 6: User Story 4 - Bird Egg Visual Update (Priority: P3)

**Goal**: Replace bird droppings with oval cream-colored eggs that are 1.5x larger, disappear on ground impact, same damage mechanics

**Independent Test**: Observe birds dropping cream-colored oval eggs that disappear on hitting ground and kill player on contact

### Implementation for User Story 4

- [ ] T098 [US4] Update `src/entities/EnemyProjectile.ts` to add egg type variant with scale 1.5 (EGG_SCALE constant)
- [ ] T099 [US4] Update `src/entities/EnemyProjectile.ts` to implement destroyOnGroundImpact behavior (destroy on ground collision, play egg-impact SFX)
- [ ] T100 [US4] Update `src/entities/EnemyBird.ts` projectile spawning to use egg sprite and scale instead of dropping sprite
- [ ] T101 [US4] Update `src/scenes/GameScene.ts` setupCollisions() to add egg-ground collision handler (calls projectile.destroy(), plays SFX)
- [ ] T102 [US4] Verify egg projectile maintains same fall speed and player damage mechanics as original dropping

### Testing for User Story 4

- [ ] T103 [P] [US4] Manual test: Verify bird drops oval cream-colored egg projectile (not dropping)
- [ ] T104 [P] [US4] Manual test: Verify egg is visually 1.5x larger than original dropping
- [ ] T105 [P] [US4] Manual test: Verify egg disappears immediately on hitting ground with impact SFX
- [ ] T106 [P] [US4] Manual test: Verify egg falls at same speed as original dropping
- [ ] T107 [P] [US4] Manual test: Verify egg kills player on contact (same damage mechanics)
- [ ] T108 [P] [US4] Unit test in `tests/unit/entities/EnemyProjectile.test.ts`: Verify egg scale is exactly 1.5
- [ ] T109 [P] [US4] Unit test in `tests/unit/entities/EnemyProjectile.test.ts`: Verify destroyOnGroundImpact property is true for eggs

**Checkpoint**: At this point, User Stories 1-4 should all work - bird eggs replace droppings with updated visual

---

## Phase 7: User Story 5 - Improved HUD Layout (Priority: P3)

**Goal**: Reorganize HUD with lives left, time center (no "Time:" prefix, MM:SS format), coins right, all 120% scaled

**Independent Test**: Launch game and verify HUD layout matches specification (lives left, time center, coins right), all elements 20% larger, time shows MM:SS without prefix, coin counter increments by exactly 1

### Implementation for User Story 5

- [ ] T110 [US5] Update `src/managers/HUDManager.ts` to reposition lives display to left side (x: 50, y: 30, alignment: left)
- [ ] T111 [US5] Update `src/managers/HUDManager.ts` to reposition time display to center (x: CANVAS_WIDTH / 2, y: 30, alignment: center, origin: 0.5)
- [ ] T112 [US5] Update `src/managers/HUDManager.ts` to reposition coins display to right side (x: CANVAS_WIDTH - 50, y: 30, alignment: right, origin: 1)
- [ ] T113 [US5] Update `src/managers/HUDManager.ts` to apply setScale(GAME_CONFIG.SPRITE_SCALE) to all HUD elements (lives, time, coins)
- [ ] T114 [US5] Update `src/managers/HUDManager.ts` updateTime() method to format as MM:SS without "Time:" prefix (pad with leading zeros)
- [ ] T115 [US5] Update `src/managers/HUDManager.ts` updateCoins() method to add brief scale pulse animation on increment
- [ ] T116 [US5] Update `src/managers/GameStateManager.ts` incrementCoins() to verify amount parameter is exactly 1 (throw error if not)
- [ ] T117 [US5] Update coin collection logic to ensure incrementCoins(1) called exactly once per coin (fix any existing multi-increment bug)
- [ ] T118 [US5] Update all UI scenes (MainMenuScene, AboutScene, PauseScene, VictoryScene, GameOverScene) to apply setScale(1.2) to all UI elements

### Testing for User Story 5

- [ ] T119 [P] [US5] Manual test: Verify lives counter appears on left side of HUD at correct position
- [ ] T120 [P] [US5] Manual test: Verify time counter appears centered in HUD without "Time:" prefix
- [ ] T121 [P] [US5] Manual test: Verify time displays as MM:SS with leading zeros (e.g., 01:05, 61:01)
- [ ] T122 [P] [US5] Manual test: Verify coins counter appears on right side of HUD at correct position
- [ ] T123 [P] [US5] Manual test: Verify all HUD elements are 20% larger than original (measure visually)
- [ ] T124 [P] [US5] Manual test: Collect coin and verify counter increments by exactly 1 (not 2 or 0)
- [ ] T125 [P] [US5] Manual test: Verify coin counter animates briefly on increment (scale pulse)
- [ ] T126 [P] [US5] Manual test: Verify all UI scenes have 120% scaled elements (main menu, pause, game over, victory, about)
- [ ] T127 [P] [US5] Unit test in `tests/unit/managers/HUDManager.test.ts`: Verify layout positions match specification
- [ ] T128 [P] [US5] Unit test in `tests/unit/managers/HUDManager.test.ts`: Verify time formatting (MM:SS, no prefix, leading zeros)
- [ ] T129 [P] [US5] Unit test in `tests/unit/managers/HUDManager.test.ts`: Verify scale is exactly 1.2 for all elements
- [ ] T130 [P] [US5] Unit test in `tests/unit/managers/GameStateManager.test.ts`: Verify incrementCoins() only accepts amount === 1

**Checkpoint**: All user stories (1-5) should now be independently functional - complete visual and gameplay enhancement feature

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T131 [P] Performance profiling: Use Chrome DevTools to measure frame timing across all enhancements, verify sustained 60 fps
- [ ] T132 [P] Memory profiling: Verify total asset size <2MB compressed, texture memory within budget (~550KB additional)
- [ ] T133 Performance optimization: If frame time exceeds 16ms, optimize entity updates or cull off-screen animations
- [ ] T134 [P] Visual consistency check: Verify all new graphics (frog, grass, water, clouds, eggs) match hand-drawn aesthetic
- [ ] T135 [P] Audio integration check: Verify all new SFX (frog jump, frog defeat, egg impact) play at correct events
- [ ] T136 [P] Edge case testing: Test frog at platform edge with player behind, frog pathfinding on different elevations, player death during frog mid-jump
- [ ] T137 [P] Edge case testing: Test moving platform synchronization on checkpoint respawn, camera viewport with scaled sprites, clouds moving backward (player moves left)
- [ ] T138 [P] Edge case testing: Test bird eggs mid-flight when player dies, wizard hat persistence after backtracking
- [ ] T139 Code review: Review all entity scale applications for consistency (1.2 for standard, 1.5 for eggs)
- [ ] T140 Code review: Review all hitbox scaling implementations to ensure proportional scaling
- [ ] T141 [P] Documentation update: Update README.md with feature changes (scaled sprites, new frog enemy, environmental graphics, extended level, HUD improvements)
- [ ] T142 [P] Documentation update: Update any existing gameplay guides or tutorials with new content
- [ ] T143 Final E2E test suite: Run complete `tests/e2e/game-visual.spec.ts` to verify all visual requirements
- [ ] T144 Final integration test: Run complete level playthrough, verify 8-10 minute completion, all 4 checkpoints, all 3 wizard hats, boss fight
- [ ] T145 Accessibility check: Verify scaled sprites improve visibility for 7-8 year old players
- [ ] T146 Playtesting: Conduct playtest with target age group proxy or QA team, gather feedback on difficulty and pacing
- [ ] T147 [P] Update `game-plan.md` and `PROGRESS.md` with completion status
- [ ] T148 Run quickstart.md validation: Execute all steps in quickstart.md to verify developer guide accuracy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (asset creation and constants)
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T011) - BLOCKS all user stories
  - Requires scaled assets from Phase 1
  - Requires constants from Phase 1
  - PreloadScene updates load the assets
  - Manager updates provide core functionality needed by all stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion (T012-T025)
  - User stories can then proceed in parallel (if staffed) OR sequentially in priority order (P1 → P2 → P3)
  - US1 (Enhanced Visual Experience): Can start immediately after Foundational
  - US2 (Frog Enemy): Can start immediately after Foundational (independent of US1)
  - US3 (Extended Level): Can start immediately after Foundational (integrates US1 environmental layers, US2 frog spawns, but independently testable)
  - US4 (Bird Egg): Can start immediately after Foundational (independent of other stories)
  - US5 (HUD Layout): Can start immediately after Foundational (independent of other stories)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - MVP baseline
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 environmental layers but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Extends level with US1 layers and US2 frogs, but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Completely independent visual update
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Completely independent UI update

### Within Each User Story

**US1 (Enhanced Visual Experience)**:
- T026-T035 (entity scaling) can all run in parallel - different files
- T036-T038 (environmental layers) can run in parallel - different files
- T039-T040 (GameScene integration) sequential after layers created
- T041 (type definitions) can run in parallel with implementation
- T042-T049 (testing) can run after implementation complete

**US2 (New Frog Enemy)**:
- T050-T054 (EnemyFrog class) sequential - same file, building on each other
- T055 (EntityFactory) parallel with T050-T054 - different file
- T056-T059 (GameScene integration) sequential after EnemyFrog class complete
- T060 (type definitions) parallel with implementation
- T061-T072 (testing) can run after implementation complete

**US3 (Extended Level)**:
- T073-T080 (level data design) sequential - same file, must validate at end
- T081-T082 (Platform moving logic) sequential - same file
- T083-T087 (GameScene/Factory integration) can run in parallel after Platform updates
- T088-T097 (testing) can run after implementation complete

**US4 (Bird Egg Visual)**:
- T098-T099 (EnemyProjectile updates) sequential - same file
- T100 (EnemyBird updates) can run in parallel with T098-T099 - different file
- T101-T102 (GameScene collision/verification) sequential after projectile updates
- T103-T109 (testing) can run after implementation complete

**US5 (Improved HUD Layout)**:
- T110-T113 (HUDManager layout) sequential - same file
- T114-T115 (HUDManager methods) sequential - same file
- T116-T117 (GameStateManager coin fix) sequential - same file
- T118 (UI scenes scaling) parallel with HUDManager updates - different files
- T119-T130 (testing) can run after implementation complete

### Parallel Opportunities

**Phase 1 (Setup)**: T001-T007 (asset creation) all parallel, T008-T011 (constants updates) all parallel

**Phase 2 (Foundational)**: 
- T012-T018 (PreloadScene) all parallel updates to load different assets
- T019-T021 (AnimationManager) all parallel - creating different animation sets
- T022-T024 (GameStateManager) sequential - same file
- T025 (AudioManager) parallel with all others

**Phase 3 (US1)**:
- T026-T035 all parallel (different entity files)
- T036-T038 all parallel (different layer files)
- T042-T049 all parallel (different test files)

**Phase 4 (US2)**:
- T061-T072 all parallel (different test files)

**Phase 5 (US3)**:
- T088-T097 all parallel (different test types)

**Phase 6 (US4)**:
- T103-T109 all parallel (different test files)

**Phase 7 (US5)**:
- T119-T130 all parallel (different test files)

**Phase 8 (Polish)**:
- T131-T132 parallel (profiling)
- T134-T135 parallel (checks)
- T136-T138 parallel (edge case testing)
- T140-T142 parallel (documentation)

---

## Parallel Example: User Story 1 (Enhanced Visual Experience)

```bash
# Launch all entity scaling tasks together (Phase 3, T026-T035):
Task T026: Update Player.ts scale
Task T027: Update EnemyBird.ts scale
Task T028: Update EnemyShark.ts scale
Task T029: Update Boss.ts scale
Task T030: Update Platform.ts scale
Task T031: Update Coin.ts scale
Task T032: Update PowerUpWizardHat.ts scale
Task T033: Update Checkpoint.ts scale
Task T034: Update PlayerProjectile.ts scale
Task T035: Update BossProjectile.ts scale

# Launch all environmental layer creation together (T036-T038):
Task T036: Create GrassLayer.ts
Task T037: Create WaterHazard.ts
Task T038: Create CloudLayer.ts

# Launch all tests together after implementation (T042-T049):
Task T042: Manual test - sprite sizes
Task T043: Manual test - grass animation
Task T044: Manual test - water animation
Task T045: Manual test - cloud parallax
Task T046: Manual test - collision detection
Task T047: E2E visual regression test
Task T048: Unit test - GrassLayer
Task T049: Unit test - CloudLayer
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Enhanced Visual Experience)

1. Complete Phase 1: Setup (asset creation, T001-T011) - **~2-3 days**
2. Complete Phase 2: Foundational (core systems, T012-T025) - **~2 days**
3. Complete Phase 3: User Story 1 (visual scaling + environmental layers, T026-T049) - **~3-4 days**
4. **STOP and VALIDATE**: Test User Story 1 independently - game should have larger sprites, animated grass, water in pits, parallax clouds
5. Deploy/demo MVP if ready - **~7-9 days total for MVP**

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready - **~4-5 days**
2. Add User Story 1 (P1) → Test independently → Deploy/Demo (MVP!) - **+3-4 days = ~7-9 days**
3. Add User Story 2 (P2) → Test independently → Deploy/Demo - **+2-3 days = ~9-12 days**
4. Add User Story 3 (P2) → Test independently → Deploy/Demo - **+3-4 days = ~12-16 days**
5. Add User Story 4 (P3) → Test independently → Deploy/Demo - **+1 day = ~13-17 days**
6. Add User Story 5 (P3) → Test independently → Deploy/Demo - **+2 days = ~15-19 days**
7. Polish & validation (Phase 8) → Final release - **+2-3 days = ~17-22 days total**

Each story adds value without breaking previous stories.

### Parallel Team Strategy (3 developers)

With 3 developers after Foundational phase completes:

1. Team completes Setup + Foundational together - **~4-5 days**
2. Once Foundational is done:
   - Developer A: User Story 1 (Enhanced Visual Experience) - **~3-4 days**
   - Developer B: User Story 2 (Frog Enemy) + User Story 4 (Bird Egg) - **~3-4 days**
   - Developer C: User Story 5 (HUD Layout) - **~2 days**, then start User Story 3 (Extended Level) - **+3-4 days**
3. Integration: User Story 3 pulls in US1 environmental layers and US2 frog spawns - **~1 day integration**
4. Polish together - **~2 days**

**Total parallel timeline**: ~10-12 days with 3 developers

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label (US1-US5) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Foundational phase (Phase 2) is CRITICAL - blocks all user stories until complete
- Asset creation (Phase 1) can proceed in parallel with planning/design review
- Tests are included for validation but not TDD approach (not explicitly requested in spec)
- Commit after each task or logical group of related tasks
- Performance target: 60 fps sustained with all enhancements active
- Asset budget: <2MB compressed total, ~550KB additional for this feature
- Frame budget: <16ms per frame, ~3.1ms additional overhead for this feature
