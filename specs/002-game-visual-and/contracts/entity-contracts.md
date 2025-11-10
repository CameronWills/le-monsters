# Entity Contracts

**Feature**: 002-game-visual-and  
**Date**: 2025-11-09  
**Purpose**: Define behavioral contracts for all game entity classes

## Overview

This document specifies the interfaces and behavioral contracts that entity classes must implement for the visual and gameplay enhancements feature. All contracts ensure deterministic behavior and maintain the 60 fps performance target.

---

## 1. Base Entity Contract

All game entities must implement this base contract.

```typescript
interface IGameEntity {
  // === Identity ===
  readonly id: string;
  readonly type: EntityType;
  
  // === Transform ===
  position: Phaser.Math.Vector2;
  readonly scale: number;          // 1.2 for most entities, 1.5 for eggs
  
  // === Physics ===
  body: Phaser.Physics.Arcade.Body;
  hitbox: { width: number; height: number };
  
  // === Lifecycle ===
  create(scene: Phaser.Scene, x: number, y: number): void;
  update(time: number, delta: number): void;
  destroy(): void;
  
  // === Rendering ===
  setDepth(depth: number): void;
  setVisible(visible: boolean): void;
  
  // === Contracts ===
  validateScale(): boolean;        // Ensures scale matches requirements
  validateHitbox(): boolean;       // Ensures hitbox scales proportionally
}

type EntityType = 
  | 'player' 
  | 'enemy-bird' 
  | 'enemy-shark' 
  | 'enemy-frog' 
  | 'boss'
  | 'platform'
  | 'moving-platform'
  | 'coin'
  | 'wizard-hat'
  | 'checkpoint'
  | 'projectile-player'
  | 'projectile-enemy'
  | 'projectile-boss';
```

### Validation Contract

```typescript
/**
 * validateScale()
 * MUST return true if entity scale matches specification:
 * - Standard entities: scale === 1.2
 * - Bird eggs: scale === 1.5
 * - Environmental layers: scale not required
 */

/**
 * validateHitbox()
 * MUST return true if hitbox dimensions scale proportionally:
 * - hitbox.width === baseWidth * scale
 * - hitbox.height === baseHeight * scale
 * Tolerance: ±1 pixel for rounding
 */
```

---

## 2. Player Entity Contract

```typescript
interface IPlayer extends IGameEntity {
  // === State ===
  readonly state: PlayerState;
  readonly facingDirection: 'left' | 'right';
  readonly lives: number;
  readonly hasPowerUp: boolean;
  readonly invincible: boolean;
  
  // === Movement ===
  move(direction: 'left' | 'right' | 'stop'): void;
  jump(): void;
  
  // === Combat ===
  shoot(): void;
  takeDamage(): void;
  
  // === Power-ups ===
  collectWizardHat(): void;
  losePowerUp(): void;
  
  // === Respawn ===
  respawn(checkpoint: Phaser.Math.Vector2): void;
  setInvincible(duration: number): void;
  
  // === Contracts ===
  scale: 1.2;                      // MUST be exactly 1.2
  hitbox: { width: number * 1.2; height: number * 1.2 };
}

type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'dead';
```

### Behavioral Contracts

```typescript
/**
 * move(direction)
 * MUST apply acceleration toward direction up to PLAYER_SPEED
 * MUST update facingDirection if direction !== 'stop'
 * MUST transition state from 'idle' to 'running' if grounded
 * MUST respect physics constraints (collision with platforms)
 */

/**
 * jump()
 * MUST apply PLAYER_JUMP_VELOCITY if grounded
 * MUST transition state to 'jumping'
 * MUST play jump animation
 * MUST trigger jump SFX
 * MUST NOT allow jump if already airborne
 */

/**
 * shoot()
 * MUST only fire if hasPowerUp === true
 * MUST respect SHOOT_COOLDOWN (1 second between shots)
 * MUST spawn projectile in facing direction
 * MUST trigger shoot SFX
 * MUST NOT fire if cooldown active
 */

/**
 * takeDamage()
 * MUST decrement lives by 1
 * MUST trigger death animation and SFX
 * MUST set state to 'dead'
 * MUST disable input
 * MUST trigger respawn after PLAYER_RESPAWN_DELAY (2 seconds)
 * MUST NOT apply damage if invincible === true
 */

/**
 * respawn(checkpoint)
 * MUST reset position to checkpoint
 * MUST reset velocity to zero
 * MUST set state to 'idle'
 * MUST enable input
 * MUST call setInvincible(PLAYER_INVINCIBILITY_DURATION)
 * MUST reset hasPowerUp to false
 */

/**
 * setInvincible(duration)
 * MUST set invincible = true
 * MUST create timer for duration milliseconds
 * MUST flash sprite during invincibility (visual feedback)
 * MUST set invincible = false after duration expires
 */
```

---

## 3. EnemyFrog Contract - NEW

```typescript
interface IEnemyFrog extends IGameEntity {
  // === State ===
  readonly state: FrogState;
  readonly facingDirection: 'left' | 'right';
  readonly grounded: boolean;
  
  // === AI Behavior ===
  detectPlayer(player: IPlayer): 'left' | 'right' | null;
  checkPlatformEdge(): boolean;
  performJump(): void;
  
  // === Combat ===
  onStomped(): void;
  onProjectileHit(): void;
  
  // === Timers ===
  readonly jumpTimer: number;
  readonly jumpInterval: 2000;    // MUST be exactly 2000ms
  
  // === Contracts ===
  scale: 1.2;
  jumpSpeed: number;              // Range: 50-150 px/s
  jumpHeight: number;             // Range: -200 to -300 (negative = upward)
}

type FrogState = 'stationary' | 'jumping' | 'defeated';
```

### Behavioral Contracts

```typescript
/**
 * detectPlayer(player)
 * MUST return 'left' if player.x < this.x
 * MUST return 'right' if player.x > this.x
 * MUST return null if player is not within detection range
 * Detection range: entire level (always tracks player)
 */

/**
 * checkPlatformEdge()
 * MUST raycast downward from position ahead of frog (direction-dependent)
 * Raycast distance ahead: 20 pixels
 * Raycast depth: 50 pixels downward
 * MUST return true if no platform detected (edge found)
 * MUST return false if platform continues
 */

/**
 * performJump()
 * MUST only execute if jumpTimer >= 2000ms
 * MUST call detectPlayer() to determine direction
 * MUST call checkPlatformEdge() before applying velocity
 * If edge detected:
 *   - MUST set velocity to zero (stop at edge)
 *   - MUST NOT change state
 * If no edge:
 *   - MUST apply jump velocity: setVelocity(direction * jumpSpeed, jumpHeight)
 *   - MUST transition state to 'jumping'
 *   - MUST play jumping animation
 *   - MUST trigger frog-jump SFX
 * MUST reset jumpTimer to 0
 */

/**
 * update(time, delta)
 * MUST increment jumpTimer by delta each frame
 * If grounded and state === 'stationary' and jumpTimer >= 2000:
 *   - MUST call performJump()
 * If not grounded and state === 'jumping':
 *   - Continue physics simulation
 * If grounded and state === 'jumping':
 *   - MUST transition state to 'stationary'
 *   - MUST play stationary animation
 */

/**
 * onStomped()
 * MUST transition state to 'defeated'
 * MUST play defeat animation
 * MUST trigger frog-defeat SFX
 * MUST disable collision
 * MUST add this.id to GameStateManager.defeatedEnemies
 * MUST destroy entity after animation completes
 */

/**
 * onProjectileHit()
 * Same behavior as onStomped()
 */
```

---

## 4. Platform Contract - UPDATED

```typescript
interface IPlatform extends IGameEntity {
  // === Properties ===
  readonly platformType: 'static' | 'moving-vertical' | 'moving-horizontal';
  readonly dimensions: { width: number; height: number };
  
  // === Moving Platform ===
  readonly movement?: {
    distance: number;
    speed: number;
    axis: 'x' | 'y';
    tween: Phaser.Tweens.Tween;
  };
  
  // === Contracts ===
  scale: 1.2;
  collidable: true;
}
```

### Behavioral Contracts

```typescript
/**
 * create(scene, x, y)
 * MUST apply scale of 1.2 to sprite
 * MUST create physics body with scaled dimensions
 * MUST set body.immovable = true (platforms don't move from collisions)
 * If platformType === 'moving-vertical' or 'moving-horizontal':
 *   - MUST initialize movement tween
 */

/**
 * initializeMovement()
 * MUST create Phaser tween with properties:
 *   - targets: this
 *   - duration: (distance / speed) * 1000
 *   - yoyo: true (oscillate back and forth)
 *   - repeat: -1 (infinite loop)
 *   - ease: 'Sine.easeInOut' (smooth acceleration/deceleration)
 * For vertical: tween 'y' property
 * For horizontal: tween 'x' property
 * MUST update physics body position each frame (Phaser handles automatically)
 */

/**
 * update(time, delta)
 * Moving platforms: No explicit update needed (tween handles movement)
 * Static platforms: No update needed
 */
```

---

## 5. EnemyProjectile (Bird Egg) Contract - UPDATED

```typescript
interface IEnemyProjectile extends IGameEntity {
  // === Properties ===
  readonly projectileType: 'egg';  // Changed from 'dropping'
  readonly velocity: Phaser.Math.Vector2;
  lifetime: number;
  readonly maxLifetime: 2000;      // Pixels fallen
  
  // === Contracts ===
  scale: 1.5;                      // MUST be exactly 1.5
  destroyOnGroundImpact: true;
}
```

### Behavioral Contracts

```typescript
/**
 * create(scene, x, y)
 * MUST apply scale of 1.5 to egg sprite
 * MUST set velocity to (0, fallSpeed) - straight downward
 * MUST create collision handler for ground platforms
 * MUST create collision handler for player
 * MUST set lifetime to 0
 */

/**
 * update(time, delta)
 * MUST increment lifetime by velocity.y * delta
 * If lifetime >= maxLifetime:
 *   - MUST destroy projectile
 */

/**
 * onGroundCollision()
 * MUST destroy projectile immediately
 * MUST trigger egg-impact SFX
 * MUST NOT damage ground (visual-only collision)
 */

/**
 * onPlayerCollision()
 * MUST call player.takeDamage()
 * MUST destroy projectile
 */
```

---

## 6. Collectible Contracts - UPDATED

### ICoin

```typescript
interface ICoin extends IGameEntity {
  readonly collected: boolean;
  
  // === Contracts ===
  scale: 1.2;
  incrementAmount: 1;              // MUST increment coin counter by exactly 1
}
```

**Behavioral Contract**:
```typescript
/**
 * onPlayerCollision()
 * MUST set collected = true
 * MUST call GameStateManager.incrementCoins(1)  // Exactly 1, not any other value
 * MUST trigger collect-coin SFX
 * MUST play collection animation
 * MUST destroy after animation completes
 * MUST add this.id to GameStateManager.collectedItems
 */
```

### IWizardHat

```typescript
interface IWizardHat extends IGameEntity {
  readonly collected: boolean;
  
  // === Contracts ===
  scale: 1.2;
}
```

**Behavioral Contract**:
```typescript
/**
 * onPlayerCollision()
 * MUST set collected = true
 * MUST call player.collectWizardHat()
 * MUST trigger collect-powerup SFX
 * MUST play collection animation
 * MUST destroy after animation completes
 * MUST add this.id to GameStateManager.collectedItems
 */
```

### ICheckpoint

```typescript
interface ICheckpoint extends IGameEntity {
  readonly activated: boolean;
  
  // === Contracts ===
  scale: 1.2;
  persistOnDeath: true;            // Does not reset when player dies
}
```

**Behavioral Contract**:
```typescript
/**
 * onPlayerPass()
 * MUST only activate once (if already activated, do nothing)
 * MUST set activated = true
 * MUST play flag-raise animation
 * MUST trigger checkpoint SFX
 * MUST call GameStateManager.setCheckpoint(this.position)
 * MUST NOT reset on player death (stays raised)
 */
```

---

## 7. Environmental Layer Contracts - NEW

### IGrassLayer

```typescript
interface IGrassLayer {
  // === Properties ===
  readonly type: 'grass-layer';
  readonly position: Phaser.Math.Vector2;
  readonly dimensions: { width: number; height: 30 };
  readonly animation: AnimationConfig;
  
  // === Rendering ===
  tileSprite: Phaser.GameObjects.TileSprite;
  depth: 5;                        // Between ground and platforms
  
  // === Contracts ===
  height: 30;                      // MUST be exactly 30 pixels
}

interface AnimationConfig {
  frames: string[];
  frameRate: number;               // Range: 4-8 fps
  loop: true;
}
```

**Behavioral Contract**:
```typescript
/**
 * create(scene, x, y, width)
 * MUST create TileSprite with grass texture
 * MUST set dimensions to (width, 30)
 * MUST position at top edge of ground platform (y coordinate)
 * MUST set depth to 5 (render above ground, below platforms)
 * MUST start waving animation immediately
 */

/**
 * update(time, delta)
 * No update needed (animation system handles frame cycling)
 */
```

### IWaterHazard

```typescript
interface IWaterHazard {
  // === Properties ===
  readonly type: 'water-hazard';
  readonly position: Phaser.Math.Vector2;
  readonly dimensions: { width: number; height: number };
  readonly animation: AnimationConfig;
  readonly color: string;          // Ocean blue #0077BE
  
  // === Rendering ===
  sprite: Phaser.GameObjects.Sprite;
  depth: 1;                        // Background layer
  
  // === Contracts ===
  color: '#0077BE';                // MUST be ocean blue
}
```

**Behavioral Contract**:
```typescript
/**
 * create(scene, x, y, width, height)
 * MUST create sprite(s) covering pit area
 * MUST set color tint to ocean blue
 * MUST set depth to 1 (background, visible behind all gameplay)
 * MUST start wave animation immediately
 * MUST NOT create collision (pits already handle death)
 */

/**
 * update(time, delta)
 * No update needed (animation system handles frame cycling)
 */
```

### ICloudLayer

```typescript
interface ICloudLayer {
  // === Properties ===
  readonly type: 'cloud-layer';
  readonly scrollFactor: 0.5;      // MUST be exactly 0.5
  readonly depth: 0;               // MUST be 0 (background)
  
  // === Rendering ===
  tileSprite: Phaser.GameObjects.TileSprite;
  
  // === Contracts ===
  scrollFactor: 0.5;               // MUST move at 50% camera speed
}
```

**Behavioral Contract**:
```typescript
/**
 * create(scene, x, y, width, height)
 * MUST create TileSprite with cloud texture
 * MUST set depth to 0 (behind everything)
 * MUST position in upper portion of canvas (sky region)
 * MUST NOT animate frames (static cloud texture)
 */

/**
 * update(time, delta)
 * MUST update tilePositionX based on camera scroll:
 *   tileSprite.tilePositionX = camera.scrollX * 0.5
 * MUST update every frame (creates parallax effect)
 */
```

---

## 8. Performance Contracts

All entities must adhere to these performance contracts:

### Frame Budget Contract

```typescript
/**
 * Each entity type MUST complete its update() method within allocated budget:
 * - Player: 2ms
 * - Enemy (each): 0.5ms
 * - Frog (each): 0.6ms (includes raycast)
 * - Platform (static): 0ms (no update needed)
 * - Platform (moving): 0.1ms (tween update)
 * - Projectile (each): 0.1ms
 * - Grass layer (all): 0.5ms total
 * - Water hazard (all): 0.3ms total
 * - Cloud layer: 0.1ms
 * 
 * Total frame budget: 16ms (60 fps target)
 * Entity update budget: 6ms (leaves 10ms for rendering, physics, etc.)
 */
```

### Memory Contract

```typescript
/**
 * Sprite assets MUST NOT exceed memory budget:
 * - Scaled sprite sheets: 300KB total
 * - New entity sprites (frog, grass, water, clouds, eggs): 230KB total
 * - Total additional memory: 530KB
 * - Total game assets: <2MB compressed
 */
```

### Collision Contract

```typescript
/**
 * All entities with physics bodies MUST:
 * - Define collision category and mask
 * - Use scaled hitboxes (proportional to sprite scale)
 * - Enable collision only when active (disable when defeated/collected)
 * - Clean up collision handlers on destroy()
 */
```

---

## 9. State Synchronization Contracts

### Enemy Respawn Contract

```typescript
/**
 * All enemy entities MUST participate in respawn tracking:
 * 
 * On defeat:
 *   - MUST call GameStateManager.addDefeatedEnemy(this.id)
 * 
 * On spawn attempt:
 *   - MUST check GameStateManager.isEnemyDefeated(this.id)
 *   - If true: MUST skip spawn (don't create entity)
 * 
 * On player death:
 *   - GameStateManager MUST clear defeatedEnemies set
 *   - All enemies MUST respawn at original positions from level data
 */
```

### Collectible Respawn Contract

```typescript
/**
 * All collectible entities MUST participate in collection tracking:
 * 
 * On collection:
 *   - MUST call GameStateManager.addCollectedItem(this.id)
 * 
 * On spawn attempt:
 *   - MUST check GameStateManager.isItemCollected(this.id)
 *   - If true: MUST skip spawn (don't create entity)
 * 
 * On player death:
 *   - GameStateManager MUST clear collectedItems set
 *   - All collectibles MUST respawn at original positions from level data
 * 
 * Exception: Checkpoints do NOT respawn (stay activated)
 */
```

---

## 10. Testing Contracts

Each entity class MUST provide unit tests verifying:

1. **Scale Validation**:
   - `validateScale()` returns true
   - Visual sprite scale matches specification
   - Hitbox scale matches specification

2. **State Transitions**:
   - All valid state transitions work correctly
   - Invalid state transitions are rejected
   - State changes trigger appropriate animations/SFX

3. **Behavioral Contracts**:
   - Each method satisfies its documented contract
   - Edge cases handled correctly
   - Performance within frame budget

4. **Integration**:
   - Collision handlers trigger correctly
   - Physics interactions deterministic
   - No memory leaks (entities destroyed properly)

---

## Conclusion

These contracts define the behavioral requirements for all entity classes in the game visual and gameplay enhancements feature. All implementations must satisfy these contracts to ensure deterministic gameplay, performance within the 60 fps target, and consistent visual/audio feedback.

**Next**: Generate manager-contracts.md and scene-contracts.md for system-level behavioral contracts.
