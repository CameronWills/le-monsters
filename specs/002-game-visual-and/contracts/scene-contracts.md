# Scene Contracts

**Feature**: 002-game-visual-and  
**Date**: 2025-11-09  
**Purpose**: Define behavioral contracts for scene lifecycle and coordination

## Overview

Phaser scenes manage the game lifecycle through distinct phases (preload, create, update). This document specifies the contracts each scene must implement for the visual and gameplay enhancements feature, focusing on GameScene (primary), PreloadScene (asset loading), and UI scenes (scaling).

---

## 1. Scene Lifecycle Contract

All scenes MUST implement the standard Phaser lifecycle:

```typescript
interface IScene {
  // === Lifecycle Methods ===
  preload?(): void;              // Optional: load assets
  create(): void;                // Required: initialize scene
  update(time: number, delta: number): void;  // Required: per-frame logic
  
  // === Scene Management ===
  scene: Phaser.Scenes.ScenePlugin;
  
  // === Common Properties ===
  cameras: Phaser.Cameras.Scene2D.CameraManager;
  physics: Phaser.Physics.Arcade.ArcadePhysics;
  add: Phaser.GameObjects.GameObjectFactory;
  time: Phaser.Time.Clock;
}
```

---

## 2. PreloadScene Contract - UPDATED

**Purpose**: Load all game assets including new scaled sprites and environmental graphics.

```typescript
interface IPreloadScene extends IScene {
  // === Asset Loading ===
  loadScaledSprites(): void;
  loadEnvironmentalAssets(): void;
  loadNewAudio(): void;
  loadLevelData(): void;
  
  // === Progress Tracking ===
  createLoadingBar(): void;
  updateLoadingBar(progress: number): void;
}
```

### Behavioral Contracts

```typescript
/**
 * preload()
 * MUST load all game assets before transitioning to MainMenuScene
 * MUST call all load*() methods
 * MUST display loading progress bar
 * MUST handle loading errors gracefully (log, use fallbacks)
 * Target load time: <3 seconds on standard broadband
 */

/**
 * loadScaledSprites()
 * MUST load new sprite sheets at 120% scale:
 *   - 'hugo-120': Player sprite sheet (120%)
 *   - 'enemies-120': Bird/shark/frog sprites (120%)
 *   - 'boss-120': Boss sprite sheet (120%)
 *   - 'platforms-120': Platform sprites (120%)
 *   - 'collectibles-120': Coin/wizard hat/checkpoint sprites (120%)
 *   - 'ui-120': HUD elements (120%)
 *   - 'bird-egg': Egg projectile sprite (150% of original dropping)
 * 
 * OR maintain existing keys and apply scale in entity constructors
 * Decision: Document which approach taken in implementation
 */

/**
 * loadEnvironmentalAssets()
 * MUST load new environmental graphics:
 *   - 'grass-layer': 30px tall grass sprite/animation frames
 *   - 'water-animation': Water wave animation frames
 *   - 'clouds': Cloud sprite/tile for parallax background
 * 
 * Format: Sprite sheets or individual images depending on animation needs
 */

/**
 * loadNewAudio()
 * MUST load new SFX:
 *   - 'sfx-frog-jump': Frog jump sound (OGG/MP3)
 *   - 'sfx-frog-defeat': Frog defeat sound (OGG/MP3)
 *   - 'sfx-egg-impact': Egg hitting ground sound (OGG/MP3)
 * 
 * MUST handle missing files gracefully (log warning, continue)
 */

/**
 * loadLevelData()
 * MUST load extended level1.json
 * MUST validate JSON structure before use
 * MUST handle parse errors gracefully (fallback to default level)
 */

/**
 * create()
 * MUST transition to MainMenuScene after all assets loaded
 * MUST initialize AnimationManager.createAnimations()
 * MUST NOT start gameplay (MainMenuScene handles that)
 */
```

---

## 3. GameScene Contract - MAJOR UPDATES

**Purpose**: Main gameplay scene with extended level, new entities, and environmental layers.

```typescript
interface IGameScene extends IScene {
  // === Managers ===
  inputManager: IInputManager;
  audioManager: IAudioManager;
  animationManager: IAnimationManager;
  gameStateManager: IGameStateManager;
  hudManager: IHUDManager;
  
  // === Entities ===
  player: IPlayer;
  enemies: Phaser.GameObjects.Group;  // Birds, sharks, frogs
  platforms: Phaser.GameObjects.Group;
  collectibles: Phaser.GameObjects.Group;
  boss: IBoss;
  
  // === Environmental Layers (NEW) ===
  grassLayers: Phaser.GameObjects.Group;
  waterHazards: Phaser.GameObjects.Group;
  cloudLayer: ICloudLayer;
  
  // === Level Data ===
  levelData: LevelData;
  
  // === Scene Lifecycle ===
  loadLevel(data: LevelData): void;
  spawnEntities(): void;
  setupCollisions(): void;
  setupLayers(): void;
  
  // === Update Logic ===
  updateEntities(time: number, delta: number): void;
  updateEnvironment(time: number, delta: number): void;
  updateCamera(time: number, delta: number): void;
}
```

### Behavioral Contracts

```typescript
/**
 * create()
 * MUST execute in this order:
 * 1. Initialize managers (see manager integration contracts)
 * 2. Load level data from JSON
 * 3. Setup environmental layers (grass, water, clouds)
 * 4. Spawn platforms (static and moving)
 * 5. Spawn enemies (birds, sharks, frogs)
 * 6. Spawn collectibles (coins, wizard hats, checkpoints)
 * 7. Spawn player at level start or current checkpoint
 * 8. Setup collision handlers
 * 9. Setup camera following player
 * 10. Start background music
 * 11. Create HUD
 * 
 * MUST handle missing assets gracefully (log error, skip entity)
 * MUST complete within 1 second (scene initialization budget)
 */

/**
 * loadLevel(data)
 * MUST parse level JSON structure
 * MUST validate all entity positions within world bounds
 * MUST validate checkpoint count === 4
 * MUST validate wizard hat count === 3
 * MUST validate last wizard hat after final checkpoint
 * MUST throw error if validation fails (critical requirement)
 */

/**
 * setupLayers()
 * MUST create environmental layers in depth order:
 * 1. Cloud layer (depth 0) - background
 * 2. Water hazards (depth 1) - in pits
 * 3. Grass layers (depth 5) - on ground surfaces
 * 
 * MUST position layers according to level data
 * MUST start animations for grass and water
 * MUST initialize cloud parallax scrolling
 */

/**
 * spawnEntities()
 * MUST iterate through level data and create entities:
 * - Platforms: static and moving types
 * - Enemies: check GameStateManager.isEnemyDefeated() before spawning
 * - Collectibles: check GameStateManager.isItemCollected() before spawning
 * - Player: at current checkpoint or level start
 * - Boss: at level end
 * 
 * MUST apply 120% scale to all entities during creation
 * MUST respect entity type constraints (e.g., frogs only on ground level)
 */

/**
 * setupCollisions()
 * MUST create collision handlers for:
 * - Player <-> Platforms (land)
 * - Player <-> Enemies (take damage)
 * - Player <-> Enemy Projectiles (take damage)
 * - Player <-> Collectibles (collect)
 * - Player <-> Boss (take damage)
 * - Player Projectiles <-> Enemies (defeat enemy)
 * - Player Projectiles <-> Boss (damage boss)
 * - Enemy Projectiles <-> Platforms (destroy eggs on ground)
 * - Enemies <-> Platforms (patrol bounds)
 * - Player <-> Pits (death, handled by world bounds)
 * 
 * MUST use Phaser's collision system (arcade physics)
 * MUST ensure scaled hitboxes used (not visual sprite bounds)
 */

/**
 * update(time, delta)
 * MUST update in this order:
 * 1. Update managers (InputManager, GameStateManager, HUDManager)
 * 2. Update player
 * 3. Update enemies (including frogs with jump logic)
 * 4. Update moving platforms (tweens handle automatically)
 * 5. Update projectiles (lifespan checks)
 * 6. Update environmental layers (cloud parallax, animations)
 * 7. Update camera (follow player smoothly)
 * 8. Check win/lose conditions
 * 
 * MUST complete within 16ms frame budget
 * MUST handle entity destruction during iteration (use groups safely)
 */

/**
 * updateEnvironment(time, delta)
 * MUST update cloud layer parallax:
 *   cloudLayer.tilePositionX = camera.scrollX * 0.5
 * MUST cull off-screen grass/water animations (performance optimization)
 * MUST NOT update grass/water manually (Phaser animation system handles)
 */

/**
 * updateCamera(time, delta)
 * MUST follow player smoothly (lerp or deadzone)
 * MUST respect world bounds (don't show outside level)
 * MUST maintain consistent follow speed regardless of frame rate
 */
```

### Level Extension Contracts

```typescript
/**
 * Level Length Validation
 * MUST verify level supports 8-10 minute completion:
 *   - Measure distance from start to boss
 *   - Estimate traversal time based on player speed
 *   - Factor in combat, platforming, backtracking
 *   - If <8 min or >10 min, log warning (playtest required)
 * 
 * MUST distribute entities for consistent pacing:
 *   - Section 1 (0-25%): Tutorial, familiar mechanics
 *   - Section 2 (25-50%): Introduce frogs, increase challenge
 *   - Section 3 (50-75%): Moving platforms, complex sequences
 *   - Section 4 (75-100%): Final gauntlet, last checkpoint + wizard hat
 */

/**
 * Checkpoint Spacing Validation
 * MUST verify 4 checkpoints distributed evenly:
 *   - Checkpoint 1: ~25% through level
 *   - Checkpoint 2: ~50% through level
 *   - Checkpoint 3: ~75% through level
 *   - Checkpoint 4: ~95% through level (before boss)
 * 
 * MUST ensure fair respawn points (not in middle of hazards)
 */

/**
 * Wizard Hat Placement Validation
 * MUST verify 3 wizard hats placed strategically:
 *   - Hat 1: Early-mid level (teaches mechanic)
 *   - Hat 2: Mid-late level (optional for challenge sections)
 *   - Hat 3: After final checkpoint (required for boss fight)
 * 
 * MUST ensure Hat 3 is accessible before boss arena
 */
```

---

## 4. UI Scene Contracts - UPDATED

All UI scenes (MainMenuScene, AboutScene, PauseScene, VictoryScene, GameOverScene) MUST apply 120% scaling to UI elements.

```typescript
interface IUIScene extends IScene {
  // === Scaling ===
  readonly uiScale: 1.2;
  
  // === UI Elements ===
  title?: Phaser.GameObjects.Text;
  buttons: Phaser.GameObjects.Container[];
  background?: Phaser.GameObjects.Image;
  
  // === Lifecycle ===
  createUI(): void;
  scaleUIElements(): void;
}
```

### Behavioral Contracts

```typescript
/**
 * create()
 * MUST call createUI()
 * MUST call scaleUIElements()
 * MUST maintain consistent visual style (hand-drawn aesthetic)
 */

/**
 * createUI()
 * MUST create all text, buttons, images for scene
 * MUST position elements logically (centered, aligned)
 * MUST setup input handlers for interactive elements
 */

/**
 * scaleUIElements()
 * MUST apply 1.2 scale to all UI game objects:
 *   - Text: setScale(1.2) or increase font size by 20%
 *   - Buttons: setScale(1.2)
 *   - Icons: setScale(1.2)
 *   - Background: scale to fit (or don't scale if full-screen)
 * 
 * MUST maintain layout proportions (elements don't overlap)
 * MUST ensure text remains readable at 120% scale
 */
```

---

## 5. Scene Transition Contracts

```typescript
/**
 * Scene Transitions
 * MUST follow these transition rules:
 * 
 * BootScene → PreloadScene:
 *   - Immediate transition (no animation)
 * 
 * PreloadScene → MainMenuScene:
 *   - After all assets loaded
 *   - Fade transition (500ms)
 * 
 * MainMenuScene → GameScene:
 *   - On "New Game" button click
 *   - Fade transition (500ms)
 *   - Reset game state
 * 
 * GameScene → PauseScene:
 *   - On ESC key press
 *   - Pause physics, timers, animations
 *   - Overlay (don't hide GameScene)
 * 
 * PauseScene → GameScene:
 *   - On "Continue" button
 *   - Resume physics, timers, animations
 * 
 * PauseScene → MainMenuScene:
 *   - On "Main Menu" button
 *   - Confirmation dialog
 *   - Reset game state
 * 
 * GameScene → VictoryScene:
 *   - On boss defeated
 *   - Delay 2 seconds (show victory animation)
 *   - Fade transition
 * 
 * GameScene → GameOverScene:
 *   - On player lives === 0
 *   - Delay 2 seconds (show game over animation)
 *   - Fade transition
 * 
 * VictoryScene/GameOverScene → MainMenuScene:
 *   - On button click or timeout
 *   - Fade transition
 */
```

---

## 6. Camera Contracts

```typescript
/**
 * Camera Setup (GameScene)
 * MUST configure main camera:
 *   - Follow player with lerp (smooth following)
 *   - Deadzone: 200x100 (player can move within zone without camera moving)
 *   - World bounds: match level dimensions
 *   - Zoom: 1.0 (no zoom despite larger sprites)
 * 
 * MUST handle camera bounds:
 *   - Don't show area outside level
 *   - Stop following at level edges (don't show black space)
 * 
 * MUST maintain camera stability:
 *   - No jittering or sudden movements
 *   - Smooth transitions when player changes direction
 */
```

---

## 7. Performance Contracts

### Scene Update Budget

```typescript
/**
 * GameScene.update() frame budget: 16ms total
 * Breakdown:
 *   - Manager updates: 0.6ms
 *   - Entity updates: 6ms (player, enemies, platforms, projectiles)
 *   - Environmental updates: 0.5ms (parallax, animations)
 *   - Camera update: 0.2ms
 *   - Collision detection: 3ms (Phaser physics system)
 *   - Rendering: 4ms (Phaser rendering system)
 *   - Buffer: 1.7ms (safety margin)
 * 
 * Total: 16ms (60 fps target)
 * 
 * MUST profile actual performance during playtest
 * MUST optimize if frame time exceeds 16ms consistently
 */
```

### Scene Initialization Budget

```typescript
/**
 * GameScene.create() time budget: 1 second maximum
 * Breakdown:
 *   - Manager initialization: 100ms
 *   - Level data parsing: 50ms
 *   - Entity spawning: 500ms (100+ entities)
 *   - Collision setup: 100ms
 *   - Layer creation: 150ms
 *   - Camera setup: 50ms
 *   - HUD creation: 50ms
 * 
 * Total: 1 second
 * 
 * MUST show loading indicator if >500ms
 * MUST not block user input during initialization
 */
```

---

## 8. Error Handling Contracts

### Scene Recovery

```typescript
/**
 * Scenes MUST handle errors gracefully:
 * 
 * Asset Loading Failure (PreloadScene):
 *   - Log error with asset key
 *   - Use fallback asset or skip entity
 *   - Continue loading remaining assets
 *   - Display warning in dev mode
 * 
 * Level Data Parse Error (GameScene):
 *   - Log error with JSON details
 *   - Use default/fallback level
 *   - Display error message to player
 * 
 * Entity Spawn Failure (GameScene):
 *   - Log error with entity ID and type
 *   - Skip entity, continue spawning others
 *   - Don't crash entire scene
 * 
 * Physics/Collision Error (GameScene):
 *   - Log error with entity details
 *   - Disable problematic collision handler
 *   - Continue gameplay with remaining collisions
 * 
 * Manager Failure (Any Scene):
 *   - Log error with manager name
 *   - Use degraded mode (e.g., no HUD if HUDManager fails)
 *   - Don't crash entire game
 */
```

---

## 9. Testing Contracts

Each scene MUST provide integration tests verifying:

### PreloadScene Tests
- All assets load successfully (or fallback gracefully)
- Loading progress bar updates correctly
- Transition to MainMenuScene after loading

### GameScene Tests
- Level data loads and validates correctly
- All entity types spawn at correct positions
- Scaled sprites render at 120% (or 150% for eggs)
- Environmental layers render in correct depth order
- Collision handlers trigger correctly
- Camera follows player smoothly
- HUD updates reflect game state changes
- Scene maintains 60 fps under load (performance test)
- Extended level supports 8-10 minute completion (timing test)

### UI Scene Tests
- All UI elements scale to 120%
- Buttons respond to input
- Scene transitions work correctly
- Visual consistency maintained (fonts, colors, layout)

---

## 10. Scene Coordination Contracts

### Multi-Scene State Management

```typescript
/**
 * Scenes MUST coordinate through GameStateManager:
 * 
 * GameScene ↔ PauseScene:
 *   - GameScene pauses physics/timers when PauseScene active
 *   - PauseScene doesn't modify game state (read-only)
 *   - Resume restores exact state (deterministic)
 * 
 * GameScene → VictoryScene/GameOverScene:
 *   - Final game state passed to end scene
 *   - End scene displays stats (time, coins collected)
 *   - GameStateManager persists for stat display
 * 
 * AnyScene → MainMenuScene:
 *   - GameStateManager.reset() called
 *   - All scenes cleaned up (no leaks)
 *   - Fresh state for new game
 */
```

---

## Conclusion

These scene contracts define the lifecycle, coordination, and behavioral requirements for all game scenes in the visual and gameplay enhancements feature. All implementations must satisfy these contracts to ensure reliable scene transitions, proper entity management, and consistent performance.

**Next**: Generate quickstart.md with developer setup and implementation guide.
