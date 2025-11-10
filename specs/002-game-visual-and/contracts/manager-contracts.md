# Manager Contracts

**Feature**: 002-game-visual-and  
**Date**: 2025-11-09  
**Purpose**: Define behavioral contracts for manager systems (HUD, Animation, GameState, Audio)

## Overview

Manager systems coordinate cross-cutting concerns across entities and scenes. This document specifies the contracts each manager must implement for the visual and gameplay enhancements feature.

---

## 1. HUDManager Contract - UPDATED

```typescript
interface IHUDManager {
  // === Properties ===
  readonly scale: 1.2;             // All HUD elements scaled to 120%
  readonly layout: HUDLayout;
  
  // === UI Elements ===
  livesDisplay: Phaser.GameObjects.Text | Phaser.GameObjects.Container;
  timeDisplay: Phaser.GameObjects.Text;
  coinsDisplay: Phaser.GameObjects.Text | Phaser.GameObjects.Container;
  
  // === Lifecycle ===
  create(scene: Phaser.Scene): void;
  update(time: number, delta: number): void;
  destroy(): void;
  
  // === Updates ===
  updateLives(lives: number): void;
  updateTime(seconds: number): void;
  updateCoins(coins: number): void;
  
  // === Contracts ===
  timeFormat: 'MM:SS';             // No "Time:" prefix
  coinIncrementExact: 1;           // Must increment by exactly 1
}

interface HUDLayout {
  lives: { x: 50; y: 30; alignment: 'left' };
  time: { x: number /* CANVAS_WIDTH / 2 */; y: 30; alignment: 'center' };
  coins: { x: number /* CANVAS_WIDTH - 50 */; y: 30; alignment: 'right' };
}
```

### Behavioral Contracts

```typescript
/**
 * create(scene)
 * MUST create three text/container objects for lives, time, coins
 * MUST apply scale of 1.2 to all elements
 * MUST position elements according to HUDLayout:
 *   - Lives: left side (x: 50, y: 30)
 *   - Time: center (x: CANVAS_WIDTH / 2, y: 30)
 *   - Coins: right side (x: CANVAS_WIDTH - 50, y: 30)
 * MUST set depth to DEPTHS.HUD (100)
 * MUST use font consistent with hand-drawn aesthetic
 * MUST set scrollFactor to (0, 0) - fixed to camera
 */

/**
 * updateLives(lives)
 * MUST update lives display to show current count
 * Format: "Lives: {lives}" or icon-based representation
 * MUST trigger visual feedback if lives decrease (flash red, etc.)
 */

/**
 * updateTime(seconds)
 * MUST format seconds as MM:SS
 * MUST NOT include "Time:" prefix text
 * Examples:
 *   - 65 seconds → "01:05"
 *   - 3661 seconds → "61:01"
 * MUST update display text
 * MUST pad minutes and seconds with leading zeros
 */

/**
 * updateCoins(coins)
 * MUST update coins display to show current count
 * Format: "Coins: {coins}" or icon + count
 * MUST animate briefly when count increases (scale pulse, etc.)
 */

/**
 * Coin Collection Contract
 * When coin is collected:
 *   - MUST call updateCoins(currentCoins + 1)
 *   - MUST increment by exactly 1 (not 2, not 0)
 *   - Fix any existing bug causing multi-increment
 */
```

---

## 2. AnimationManager Contract - UPDATED

```typescript
interface IAnimationManager {
  // === Lifecycle ===
  createAnimations(scene: Phaser.Scene): void;
  
  // === New Animations ===
  createFrogAnimations(): void;
  createGrassAnimation(): void;
  createWaterAnimation(): void;
  createEggAnimation(): void;
  
  // === Existing Animations (updated for scale) ===
  createPlayerAnimations(): void;  // Scaled sprites
  createEnemyAnimations(): void;   // Scaled sprites + frog
  createCollectibleAnimations(): void;  // Scaled sprites
  
  // === Contracts ===
  frogAnimations: ['frog-stationary', 'frog-jumping'];
  grassAnimation: { key: 'grass-wave'; frameRate: 6; loop: true };
  waterAnimation: { key: 'water-wave'; frameRate: 8; loop: true };
}
```

### Behavioral Contracts

```typescript
/**
 * createAnimations(scene)
 * MUST be called during scene preload or create phase
 * MUST create all animation definitions for the game
 * MUST call all create*Animations() methods
 * MUST NOT duplicate animation keys (check if exists before creating)
 */

/**
 * createFrogAnimations()
 * MUST create two animations:
 * 1. 'frog-stationary':
 *    - Frames: static frame or gentle idle motion (1-2 frames)
 *    - Frame rate: 4 fps
 *    - Loop: true
 * 2. 'frog-jumping':
 *    - Frames: jump arc frames (3-4 frames)
 *    - Frame rate: 10 fps
 *    - Loop: false (plays once per jump)
 */

/**
 * createGrassAnimation()
 * MUST create 'grass-wave' animation:
 *   - Frames: 4-6 frames showing gentle waving motion
 *   - Frame rate: 6 fps (subtle effect)
 *   - Loop: true
 *   - Yoyo: true (wave back and forth smoothly)
 */

/**
 * createWaterAnimation()
 * MUST create 'water-wave' animation:
 *   - Frames: 4-8 frames showing wave motion
 *   - Frame rate: 8 fps
 *   - Loop: true
 */

/**
 * createEggAnimation()
 * MUST update enemy projectile animations:
 *   - Change 'dropping' to 'egg' animation key
 *   - Use egg sprite frames (spinning/tumbling motion)
 *   - Frame rate: 10 fps
 *   - Loop: true (while falling)
 */

/**
 * createPlayerAnimations()
 * MUST use scaled sprite sheets (120%)
 * MUST NOT change frame counts or frame rates
 * MUST update sprite sheet keys to reference scaled versions
 */

/**
 * createEnemyAnimations()
 * MUST use scaled sprite sheets (120%)
 * MUST add frog animations (see createFrogAnimations)
 * MUST update bird/shark animations for scaled sprites
 * MUST NOT change existing frame counts or frame rates
 */

/**
 * createCollectibleAnimations()
 * MUST use scaled sprite sheets (120%)
 * MUST NOT change frame counts or frame rates (coin spin, wizard hat float, checkpoint raise)
 */
```

---

## 3. GameStateManager Contract - UPDATED

```typescript
interface IGameStateManager {
  // === State ===
  currentCheckpoint: CheckpointData;
  defeatedEnemies: Set<string>;
  collectedItems: Set<string>;
  playerState: PlayerState;
  bossState: BossState;
  timeElapsed: number;
  
  // === Enemy Tracking ===
  addDefeatedEnemy(id: string): void;
  isEnemyDefeated(id: string): boolean;
  clearDefeatedEnemies(): void;
  
  // === Item Tracking ===
  addCollectedItem(id: string): void;
  isItemCollected(id: string): boolean;
  clearCollectedItems(): void;
  
  // === Checkpoint ===
  setCheckpoint(position: Phaser.Math.Vector2): void;
  getCheckpoint(): CheckpointData;
  
  // === Player State ===
  decrementLives(): void;
  incrementCoins(amount: 1): void;  // MUST be exactly 1
  setPowerUp(active: boolean): void;
  
  // === Lifecycle ===
  reset(): void;
  save(): void;
  load(): void;
}

interface CheckpointData {
  id: string;
  position: Phaser.Math.Vector2;
}

interface PlayerState {
  lives: number;
  coins: number;
  hasPowerUp: boolean;
}

interface BossState {
  defeated: boolean;
  health: number;
}
```

### Behavioral Contracts

```typescript
/**
 * addDefeatedEnemy(id)
 * MUST add enemy ID to defeatedEnemies set
 * MUST be called when any enemy is defeated
 * MUST persist until clearDefeatedEnemies() called
 */

/**
 * isEnemyDefeated(id)
 * MUST return true if ID exists in defeatedEnemies set
 * MUST return false otherwise
 * MUST be called before spawning enemies
 */

/**
 * clearDefeatedEnemies()
 * MUST clear entire defeatedEnemies set
 * MUST be called when player dies (not on checkpoint activation)
 * MUST trigger enemy respawn logic in scene
 */

/**
 * addCollectedItem(id)
 * MUST add item ID to collectedItems set
 * MUST be called when coin or wizard hat collected
 * MUST persist until clearCollectedItems() called
 */

/**
 * isItemCollected(id)
 * MUST return true if ID exists in collectedItems set
 * MUST return false otherwise
 * MUST be called before spawning collectibles
 */

/**
 * clearCollectedItems()
 * MUST clear entire collectedItems set
 * MUST be called when player dies
 * MUST trigger collectible respawn logic in scene
 * MUST NOT clear checkpoint activation state
 */

/**
 * setCheckpoint(position)
 * MUST update currentCheckpoint with new position
 * MUST only update once per checkpoint (checkpoints don't reset)
 * MUST be called when player passes checkpoint flag
 */

/**
 * decrementLives()
 * MUST decrement playerState.lives by 1
 * MUST trigger game over if lives reach 0
 * MUST call HUDManager.updateLives(newLives)
 */

/**
 * incrementCoins(amount)
 * MUST ONLY accept amount === 1
 * MUST throw error or ignore if amount !== 1
 * MUST increment playerState.coins by 1
 * MUST call HUDManager.updateCoins(newCoins)
 * Contract ensures coin collection bug is fixed (no multi-increment)
 */

/**
 * reset()
 * MUST reset all state to initial values:
 *   - lives: 3
 *   - coins: 0
 *   - hasPowerUp: false
 *   - defeatedEnemies: empty
 *   - collectedItems: empty
 *   - currentCheckpoint: level start
 *   - timeElapsed: 0
 * MUST be called when starting new game
 */
```

---

## 4. AudioManager Contract - UPDATED

```typescript
interface IAudioManager {
  // === Music ===
  playMusic(key: string, loop: boolean): void;
  stopMusic(): void;
  
  // === SFX ===
  playSFX(key: string): void;
  
  // === New SFX Keys ===
  readonly newSFX: {
    FROG_JUMP: 'sfx-frog-jump';
    FROG_DEFEAT: 'sfx-frog-defeat';
    EGG_IMPACT: 'sfx-egg-impact';
  };
  
  // === Volume ===
  setMusicVolume(volume: number): void;
  setSFXVolume(volume: number): void;
  
  // === Lifecycle ===
  preload(scene: Phaser.Scene): void;
  destroy(): void;
}
```

### Behavioral Contracts

```typescript
/**
 * preload(scene)
 * MUST load all audio assets:
 *   - Existing music and SFX (unchanged)
 *   - New SFX: frog-jump.ogg, frog-defeat.ogg, egg-impact.ogg
 * MUST handle loading errors gracefully (fallback to silence)
 */

/**
 * playSFX(key)
 * MUST play sound effect once (not looped)
 * MUST respect SFX volume setting
 * MUST allow multiple simultaneous SFX (don't stop previous)
 * MUST handle missing audio key gracefully (log warning, don't crash)
 * 
 * New SFX triggers:
 *   - 'sfx-frog-jump': When frog performs jump
 *   - 'sfx-frog-defeat': When frog is defeated (stomp or projectile)
 *   - 'sfx-egg-impact': When bird egg hits ground
 */

/**
 * playMusic(key, loop)
 * MUST stop current music before starting new track
 * MUST loop if loop === true
 * MUST respect music volume setting
 * Existing music unchanged (gameplay, boss, victory tracks)
 */
```

---

## 5. InputManager Contract - UNCHANGED

```typescript
interface IInputManager {
  // No changes required for this feature
  // Existing input handling sufficient
  // Include here for completeness
  
  readonly keys: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    shoot: Phaser.Input.Keyboard.Key;
    pause: Phaser.Input.Keyboard.Key;
  };
  
  isMovingLeft(): boolean;
  isMovingRight(): boolean;
  isJumping(): boolean;
  isShooting(): boolean;
  isPausing(): boolean;
}
```

### Behavioral Contracts

```typescript
/**
 * No changes required for this feature
 * Existing contracts remain valid
 * Arrow keys, space, shift, ESC unchanged
 */
```

---

## 6. Manager Integration Contracts

### Initialization Order

```typescript
/**
 * Managers MUST be initialized in this order during scene create:
 * 1. InputManager (no dependencies)
 * 2. AudioManager (no dependencies)
 * 3. AnimationManager (no dependencies)
 * 4. GameStateManager (depends on AudioManager for game over SFX)
 * 5. HUDManager (depends on GameStateManager for initial values)
 * 
 * Reason: Later managers may depend on earlier managers being ready
 */
```

### Update Order

```typescript
/**
 * Managers MUST be updated in this order during scene update:
 * 1. InputManager (read inputs first)
 * 2. GameStateManager (process state changes)
 * 3. HUDManager (reflect state changes in UI)
 * 4. AudioManager (no update needed - event-driven)
 * 5. AnimationManager (no update needed - Phaser handles automatically)
 * 
 * Reason: State changes must propagate from input → state → UI
 */
```

### Cleanup Order

```typescript
/**
 * Managers MUST be destroyed in reverse initialization order:
 * 1. HUDManager
 * 2. GameStateManager
 * 3. AnimationManager
 * 4. AudioManager
 * 5. InputManager
 * 
 * Reason: Prevent dependencies on destroyed managers
 */
```

---

## 7. Performance Contracts

### Frame Budget

```typescript
/**
 * Manager update() methods MUST complete within frame budget:
 * - InputManager: 0.1ms (read keyboard state)
 * - GameStateManager: 0.2ms (state management logic)
 * - HUDManager: 0.3ms (text updates, 3 elements)
 * - AudioManager: 0ms (event-driven, no update loop)
 * - AnimationManager: 0ms (Phaser's animation system handles)
 * 
 * Total manager overhead: 0.6ms per frame
 * Remaining for entities: 15.4ms (well within 16ms budget)
 */
```

### Memory Contract

```typescript
/**
 * Managers MUST NOT leak memory:
 * - Remove all event listeners on destroy()
 * - Clear all timers and tweens on destroy()
 * - Null out all references to game objects on destroy()
 * - Remove all display objects from scene on destroy()
 */
```

---

## 8. Testing Contracts

Each manager MUST provide unit tests verifying:

### HUDManager Tests
- Layout positioning correct (lives left, time center, coins right)
- Scale applied correctly (all elements 120%)
- Time formatting correct (MM:SS, no prefix)
- Coin increment exact (always 1, never other value)

### AnimationManager Tests
- All animation keys registered
- Frame rates correct for new animations (frog, grass, water)
- Scaled sprite sheets referenced correctly
- No duplicate animation keys

### GameStateManager Tests
- Enemy respawn tracking works (defeated enemies don't respawn until player death)
- Item respawn tracking works (collected items don't respawn until player death)
- Checkpoint persistence works (doesn't reset on death)
- Coin increment restricted to exactly 1

### AudioManager Tests
- New SFX loaded correctly
- SFX triggers at correct events (frog jump, frog defeat, egg impact)
- Audio doesn't crash on missing files (graceful degradation)

---

## 9. Error Handling Contracts

### Manager Failures

```typescript
/**
 * Managers MUST handle failures gracefully:
 * 
 * AudioManager:
 *   - Missing audio file → log warning, continue without sound
 *   - Audio playback error → log error, don't crash game
 * 
 * AnimationManager:
 *   - Missing animation frames → log error, use fallback animation
 *   - Duplicate animation key → log warning, skip creation
 * 
 * HUDManager:
 *   - Invalid coin increment → log error, use default 1
 *   - Missing font → use Phaser default font
 * 
 * GameStateManager:
 *   - Save/load failure → log error, use fresh state
 *   - Invalid state data → reset to safe default
 */
```

---

## Conclusion

These manager contracts define the system-level behavioral requirements for coordinating game state, UI, animations, and audio across the visual and gameplay enhancements feature. All implementations must satisfy these contracts to ensure reliable cross-cutting functionality.

**Next**: Generate scene-contracts.md for scene lifecycle and coordination contracts.
