# Entity Contracts

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Purpose**: Define interfaces for game entities (player, enemies, collectibles)

## Base Entity Contract

All game entities must implement this base contract.

```typescript
/**
 * Base contract for all game entities
 * Provides common lifecycle and state management
 */
interface IEntity {
    /**
     * Phaser Sprite reference
     * Provides access to transform, physics body, animations
     */
    readonly sprite: Phaser.Physics.Arcade.Sprite;
    
    /**
     * Unique identifier for this entity instance
     * Used for debugging and tracking
     */
    readonly id: string;
    
    /**
     * Entity type identifier
     */
    readonly type: string;
    
    /**
     * Whether this entity is currently active
     * Inactive entities are not updated or rendered
     */
    isActive: boolean;
    
    /**
     * Update entity state
     * Called every frame from scene's update loop
     * @param delta - Time since last frame (ms)
     */
    update(delta: number): void;
    
    /**
     * Destroy entity and cleanup resources
     * Remove from scene, clear references
     */
    destroy(): void;
}
```

---

## Player Contract

**Responsibility**: Player character with movement, combat, and state management

```typescript
interface IPlayer extends IEntity {
    type: 'player';
    
    // === State Properties ===
    
    /** Current lives remaining (0-3) */
    lives: number;
    
    /** Whether player has wizard hat power-up */
    hasWizardHat: boolean;
    
    /** Temporary invincibility after respawn */
    isInvincible: boolean;
    
    /** Direction player is facing (1=right, -1=left) */
    facingDirection: 1 | -1;
    
    /** Whether player is touching ground */
    isGrounded: boolean;
    
    /** Time until next shot allowed (ms) */
    shootCooldown: number;
    
    // === Movement Methods ===
    
    /**
     * Move player horizontally
     * Applies acceleration/deceleration for smooth movement
     * @param direction - -1 (left), 0 (stop), 1 (right)
     */
    move(direction: -1 | 0 | 1): void;
    
    /**
     * Make player jump
     * Only works when isGrounded === true
     * Jump height varies based on horizontal velocity
     */
    jump(): void;
    
    /**
     * Stop horizontal movement
     * Applies deceleration
     */
    stop(): void;
    
    // === Combat Methods ===
    
    /**
     * Shoot wizard staff projectile
     * Only works when hasWizardHat === true
     * Rate limited by shootCooldown
     * @returns Created projectile or null if on cooldown
     */
    shoot(): IPlayerProjectile | null;
    
    /**
     * Perform stomp attack on enemy
     * Called when landing on enemy's head
     * @param enemy - Enemy to stomp
     */
    stompEnemy(enemy: IEnemy): void;
    
    // === Damage & Respawn ===
    
    /**
     * Take damage from hazard or enemy
     * Decreases lives, triggers death if > 0 lives remain
     * Triggers game over if lives reach 0
     */
    takeDamage(): void;
    
    /**
     * Respawn at checkpoint
     * - Resets position
     * - Grants invincibility
     * - Removes power-ups
     * @param checkpoint - Checkpoint to respawn at
     */
    respawnAtCheckpoint(checkpoint: ICheckpoint): void;
    
    /**
     * Grant temporary invincibility
     * Used after respawn
     * @param duration - Duration in milliseconds
     */
    makeInvincible(duration: number): void;
    
    // === Power-ups ===
    
    /**
     * Collect wizard hat power-up
     * Enables shooting ability
     */
    collectWizardHat(): void;
    
    /**
     * Remove wizard hat power-up
     * Called on death
     */
    removeWizardHat(): void;
    
    // === Animation ===
    
    /**
     * Update animation based on current state
     * Called in update loop
     * Priority: death > jump > fall > run > idle
     */
    updateAnimation(): void;
}
```

**Events Emitted**:
```typescript
player.emit('lives-changed', lives: number);
player.emit('death');
player.emit('respawn', checkpoint: ICheckpoint);
player.emit('power-up-collected', type: string);
player.emit('power-up-lost', type: string);
player.emit('shoot', projectile: IPlayerProjectile);
```

---

## Enemy Contract (Base)

**Responsibility**: Base interface for all enemy types

```typescript
interface IEnemy extends IEntity {
    type: 'enemy-bird' | 'enemy-shark';
    
    /** Whether enemy is alive */
    isAlive: boolean;
    
    /** Original spawn position for respawn */
    spawnPosition: { x: number; y: number };
    
    /**
     * Take damage from player attack
     * Triggers death sequence
     */
    takeDamage(): void;
    
    /**
     * Play death animation and destroy
     */
    die(): void;
    
    /**
     * Respawn enemy at original position
     * Called when player respawns at checkpoint
     */
    respawn(): void;
}
```

---

## Enemy Bird Contract

**Responsibility**: Flying enemy that drops hazardous droppings

```typescript
interface IEnemyBird extends IEnemy {
    type: 'enemy-bird';
    
    /** Direction of flight (1=right, -1=left) */
    flyDirection: 1 | -1;
    
    /** Flight speed (pixels/second) */
    flySpeed: number;
    
    /** Time until next dropping (ms) */
    droppingCooldown: number;
    
    /**
     * Drop a projectile (bird dropping)
     * Creates new enemy projectile below bird
     * @returns Created projectile
     */
    dropProjectile(): IEnemyProjectile;
    
    /**
     * Check if bird is off-screen
     * Destroy if too far from camera
     */
    checkBounds(): void;
}
```

**Behavior**:
- Flies horizontally at constant speed
- Drops droppings every 2-5 seconds (random)
- Destroyed when off-screen by 100+ pixels
- Respawns at original position on player respawn

---

## Enemy Shark Contract

**Responsibility**: Platform-patrolling enemy

```typescript
interface IEnemyShark extends IEnemy {
    type: 'enemy-shark';
    
    /** Left boundary of patrol (x coordinate) */
    patrolStart: number;
    
    /** Right boundary of patrol (x coordinate) */
    patrolEnd: number;
    
    /** Patrol speed (pixels/second) */
    patrolSpeed: number;
    
    /** Current patrol direction (1=right, -1=left) */
    patrolDirection: 1 | -1;
    
    /**
     * Reverse patrol direction
     * Called when reaching patrol boundary
     */
    reverseDirection(): void;
    
    /**
     * Check if at patrol boundary
     * @returns True if should reverse direction
     */
    isAtBoundary(): boolean;
}
```

**Behavior**:
- Patrols horizontally between patrolStart and patrolEnd
- Reverses direction at boundaries
- Constant Y position (hovering)
- Respawns at original position on player respawn

---

## Boss Contract

**Responsibility**: Final boss enemy with health and attack patterns

```typescript
interface IBoss extends IEntity {
    type: 'boss';
    
    // === State ===
    
    /** Current health (0-10) */
    health: number;
    
    /** Maximum health */
    readonly maxHealth: number;
    
    /** Whether boss is alive */
    isAlive: boolean;
    
    /** Whether boss can take damage (false during attack animation) */
    isVulnerable: boolean;
    
    // === Attack Pattern ===
    
    /** Current attack phase ('burst' or 'pause') */
    attackPhase: 'burst' | 'pause';
    
    /** Number of shots fired in current burst */
    burstShotsFired: number;
    
    /** Time until next phase change (ms) */
    phaseCooldown: number;
    
    /**
     * Update attack pattern
     * Manages burst/pause cycle
     */
    updateAttackPattern(delta: number): void;
    
    /**
     * Shoot projectile at player
     * Aims at player's current position
     * @returns Created projectile
     */
    shootProjectile(): IBossProjectile;
    
    /**
     * Switch to next attack phase
     * Burst → Pause → Burst (cycle)
     */
    switchPhase(): void;
    
    // === Damage & Death ===
    
    /**
     * Take damage from player projectile
     * Decreases health by 1
     * @param amount - Damage amount (always 1 for this game)
     */
    takeDamage(amount: number): void;
    
    /**
     * Trigger boss defeat sequence
     * - Stop attacks
     * - Play death animation
     * - Emit victory event
     */
    defeat(): void;
}
```

**Events Emitted**:
```typescript
boss.emit('health-changed', health: number, maxHealth: number);
boss.emit('phase-changed', phase: 'burst' | 'pause');
boss.emit('shoot', projectile: IBossProjectile);
boss.emit('defeated');
```

**Attack Pattern Timing**:
- **Burst Phase**: Fire 5 projectiles at 300ms intervals (1.5s total)
- **Pause Phase**: 2s delay before next burst
- **Cycle**: Burst → Pause → Burst (repeats until defeated)

---

## Checkpoint Contract

**Responsibility**: Auto-save points for respawn

```typescript
interface ICheckpoint extends IEntity {
    type: 'checkpoint';
    
    /** Whether checkpoint has been activated */
    isActivated: boolean;
    
    /** Flag sprite (visual indicator) */
    flagSprite: Phaser.GameObjects.Sprite;
    
    /**
     * Activate checkpoint
     * Raises flag and saves as current respawn point
     */
    activate(): void;
    
    /**
     * Get respawn position
     * @returns Position to spawn player
     */
    getRespawnPosition(): { x: number; y: number };
}
```

**Events Emitted**:
```typescript
checkpoint.emit('activated', checkpoint: ICheckpoint);
```

**Behavior**:
- Activates when player passes it (overlap detection)
- Once activated, stays activated for entire game session
- Visual flag raises when activated
- Most recently activated checkpoint used for respawn

---

## Power-Up: Wizard Hat Contract

**Responsibility**: Collectible that grants shooting ability

```typescript
interface IPowerUpWizardHat extends IEntity {
    type: 'power-up-wizard-hat';
    
    /** Whether power-up has been collected */
    isCollected: boolean;
    
    /** Original spawn position for respawn */
    spawnPosition: { x: number; y: number };
    
    /**
     * Collect power-up
     * Grants shooting ability to player
     * @param player - Player collecting the power-up
     */
    collect(player: IPlayer): void;
    
    /**
     * Respawn power-up at original position
     * Called when player dies
     */
    respawn(): void;
}
```

**Events Emitted**:
```typescript
powerUp.emit('collected', player: IPlayer);
powerUp.emit('respawned');
```

**Behavior**:
- Visible and collectible when not collected
- Hidden when collected
- Respawns at original position when player dies
- Only one wizard hat in level

---

## Coin Contract

**Responsibility**: Collectible for score tracking

```typescript
interface ICoin extends IEntity {
    type: 'coin';
    
    /** Whether coin has been collected */
    isCollected: boolean;
    
    /**
     * Collect coin
     * Increases player's coin count
     * @param player - Player collecting the coin
     */
    collect(player: IPlayer): void;
}
```

**Events Emitted**:
```typescript
coin.emit('collected', totalCoins: number);
```

**Behavior**:
- Once collected, never respawns (permanent)
- No gameplay impact (score tracking only)
- Plays sound effect and particle effect when collected

---

## Platform Contract

**Responsibility**: Solid surfaces for movement

```typescript
interface IPlatform extends IEntity {
    type: 'platform-static' | 'platform-moving';
    
    /** Platform width (pixels) */
    width: number;
    
    /** Platform height (pixels) */
    height: number;
    
    /** Texture key for platform sprite */
    textureKey: string;
}
```

---

## Moving Platform Contract

**Responsibility**: Platforms that follow predefined paths

```typescript
interface IMovingPlatform extends IPlatform {
    type: 'platform-moving';
    
    /** Waypoints defining movement path */
    path: Array<{ x: number; y: number }>;
    
    /** Movement speed (pixels/second) */
    speed: number;
    
    /** Current waypoint index */
    currentWaypoint: number;
    
    /** Visual path indicators */
    pathIndicators: Phaser.GameObjects.Graphics[];
    
    /**
     * Move toward next waypoint
     * Updates position based on speed and delta
     */
    moveAlongPath(delta: number): void;
    
    /**
     * Move to next waypoint in path
     * Cycles back to start when reaching end
     */
    advanceWaypoint(): void;
    
    /**
     * Create visual indicators showing path
     * Dots or arrows showing platform trajectory
     */
    createPathIndicators(): void;
}
```

**Behavior**:
- Follows predefined path at constant speed
- Cycles through waypoints (loops path)
- Carries player when standing on it
- Path indicators always visible

---

## Projectile Contract (Base)

**Responsibility**: Base interface for all projectiles

```typescript
interface IProjectile extends IEntity {
    type: 'projectile-player' | 'projectile-enemy' | 'projectile-boss';
    
    /** Projectile speed (pixels/second) */
    speed: number;
    
    /** Movement direction */
    direction: { x: number; y: number };
    
    /**
     * Check if projectile should be destroyed
     * @returns True if out of bounds or max distance reached
     */
    shouldDestroy(): boolean;
}
```

---

## Player Projectile Contract

**Responsibility**: Light projectiles from wizard staff

```typescript
interface IPlayerProjectile extends IProjectile {
    type: 'projectile-player';
    
    /** Distance traveled (pixels) */
    traveledDistance: number;
    
    /** Maximum distance before auto-destroy (pixels) */
    maxDistance: number;
    
    /**
     * Update projectile position
     * Destroys when maxDistance reached
     */
    update(delta: number): void;
}
```

**Behavior**:
- Travels horizontally (no gravity)
- Destroys on contact with enemy or boss
- Auto-destroys after traveling 800 pixels
- No collision with other player projectiles

---

## Enemy Projectile Contract

**Responsibility**: Bird droppings (hazards)

```typescript
interface IEnemyProjectile extends IProjectile {
    type: 'projectile-enemy';
    
    /**
     * Update projectile position
     * Affected by gravity
     * Destroys on ground contact
     */
    update(delta: number): void;
}
```

**Behavior**:
- Falls straight down (gravity applies)
- Destroys immediately on ground/platform contact
- Kills player on contact
- No horizontal movement

---

## Boss Projectile Contract

**Responsibility**: Boss attack projectiles

```typescript
interface IBossProjectile extends IProjectile {
    type: 'projectile-boss';
    
    /** Target position when fired (for aiming) */
    targetPosition: { x: number; y: number };
    
    /**
     * Update projectile position
     * Travels in straight line toward target
     */
    update(delta: number): void;
}
```

**Behavior**:
- Aims at player's position when fired
- Travels in straight line (no homing)
- Destroys on wall/platform contact
- Kills player on contact
- Does NOT collide with player projectiles

---

## Entity Factory Contract

**Responsibility**: Centralized entity creation and pooling

```typescript
interface IEntityFactory {
    /**
     * Create player entity
     */
    createPlayer(x: number, y: number): IPlayer;
    
    /**
     * Create bird enemy
     */
    createBird(x: number, y: number, flyDirection: 1 | -1): IEnemyBird;
    
    /**
     * Create shark enemy
     */
    createShark(x: number, y: number, patrolStart: number, patrolEnd: number): IEnemyShark;
    
    /**
     * Create boss
     */
    createBoss(x: number, y: number): IBoss;
    
    /**
     * Create checkpoint
     */
    createCheckpoint(x: number, y: number): ICheckpoint;
    
    /**
     * Create wizard hat power-up
     */
    createWizardHat(x: number, y: number): IPowerUpWizardHat;
    
    /**
     * Create coin
     */
    createCoin(x: number, y: number): ICoin;
    
    /**
     * Create static platform
     */
    createStaticPlatform(x: number, y: number, width: number, height: number): IPlatform;
    
    /**
     * Create moving platform
     */
    createMovingPlatform(
        x: number,
        y: number,
        width: number,
        height: number,
        path: Array<{ x: number; y: number }>,
        speed: number
    ): IMovingPlatform;
    
    /**
     * Create player projectile
     * Uses object pooling for performance
     */
    createPlayerProjectile(x: number, y: number, direction: 1 | -1): IPlayerProjectile;
    
    /**
     * Create enemy projectile
     * Uses object pooling for performance
     */
    createEnemyProjectile(x: number, y: number): IEnemyProjectile;
    
    /**
     * Create boss projectile
     * Uses object pooling for performance
     */
    createBossProjectile(x: number, y: number, targetX: number, targetY: number): IBossProjectile;
    
    /**
     * Return projectile to pool instead of destroying
     */
    recycleProjectile(projectile: IProjectile): void;
}
```

**Object Pooling Strategy**:
- Projectiles: Pre-create 50 player projectiles, 30 enemy projectiles, 20 boss projectiles
- Reuse inactive projectiles instead of create/destroy
- Improves performance and reduces GC pressure

---

**Entity Contracts Complete**: 2025-10-31  
**Next**: Manager service contracts
