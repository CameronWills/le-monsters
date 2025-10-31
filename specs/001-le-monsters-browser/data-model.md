# Data Model: Le Monsters Browser Game

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Purpose**: Define all game entities, state structures, and data relationships

## Core Entity Types

### Player (Hugo)

**Purpose**: Represents the player-controlled character with all state and capabilities

**TypeScript Interface**:
```typescript
interface IPlayer {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    facingDirection: 1 | -1; // 1 = right, -1 = left
    
    // State
    lives: number; // Always 3 at start, decreases on death
    isInvincible: boolean; // True for 1 second after respawn
    isGrounded: boolean; // True when standing on platform
    
    // Power-ups
    hasWizardHat: boolean; // True when wizard power-up is active
    
    // Animation State
    currentAnimation: 'idle' | 'run' | 'jump' | 'fall' | 'death';
    
    // Methods (implemented in Player class)
    move(direction: -1 | 0 | 1): void;
    jump(): void;
    shoot(): void;
    takeDamage(): void;
    respawnAtCheckpoint(checkpoint: ICheckpoint): void;
    collectPowerUp(powerUp: IPowerUp): void;
}
```

**Validation Rules**:
- Lives must be between 0 and 3 (inclusive)
- Position must stay within level bounds (x: 0 to levelWidth)
- Velocity.x limited to max run speed (±200 pixels/second)
- Velocity.y affected by gravity constant (-800 pixels/second²)
- Can only jump when `isGrounded === true`
- Can only shoot when `hasWizardHat === true`
- Shooting rate limited to 1 shot per second

**State Transitions**:
```
[Alive] --takeDamage()--> [Death Animation] --2s delay--> [Respawn at Checkpoint]
[No Hat] --collectPowerUp('wizard-hat')--> [Has Hat]
[Has Hat] --takeDamage()--> [No Hat] (on respawn)
[Normal] --respawn()--> [Invincible] --1s timer--> [Normal]
```

---

### Enemy: Bird

**Purpose**: Flying enemy that drops hazardous droppings

**TypeScript Interface**:
```typescript
interface IEnemyBird {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number }; // Constant horizontal movement
    
    // Configuration
    flyDirection: -1 | 1; // Direction of flight
    flySpeed: number; // Pixels per second (e.g., 100)
    
    // State
    isAlive: boolean;
    droppingCooldown: number; // Time until next dropping (milliseconds)
    
    // Methods
    update(delta: number): void;
    dropProjectile(): IEnemyProjectile;
    takeDamage(): void; // From stomp or wizard staff
}
```

**Validation Rules**:
- Must stay at constant Y position (no vertical movement)
- Dropping cooldown minimum 2 seconds, maximum 5 seconds
- Destroyed when stomped (player.y < bird.y and player falling) or hit by projectile

**Spawning Rules**:
- Spawns off-screen (x = -50 or levelWidth + 50)
- Removed when x position exceeds level bounds by 100 pixels
- Respawns at original position when player respawns at checkpoint

---

### Enemy: Hovering Shark

**Purpose**: Platform-patrolling enemy that moves horizontally

**TypeScript Interface**:
```typescript
interface IEnemyShark {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    
    // Configuration
    patrolStart: number; // Left boundary (x coordinate)
    patrolEnd: number; // Right boundary (x coordinate)
    patrolSpeed: number; // Pixels per second (e.g., 80)
    
    // State
    isAlive: boolean;
    patrolDirection: -1 | 1; // Current movement direction
    
    // Methods
    update(delta: number): void;
    reverseDirection(): void;
    takeDamage(): void;
}
```

**Validation Rules**:
- Must stay within patrol bounds (patrolStart ≤ x ≤ patrolEnd)
- Reverses direction when reaching patrol boundary
- Y position remains constant (hovering)
- Destroyed when stomped or hit by projectile

**State Transitions**:
```
[Patrolling Right] --reach patrolEnd--> [Patrolling Left]
[Patrolling Left] --reach patrolStart--> [Patrolling Right]
[Alive] --takeDamage()--> [Destroyed]
```

---

### Boss

**Purpose**: Final enemy with health bar and projectile attack patterns

**TypeScript Interface**:
```typescript
interface IBoss {
    // Transform
    position: { x: number; y: number }; // Fixed position in arena
    
    // State
    health: number; // 0-10
    maxHealth: number; // Always 10
    isAlive: boolean;
    isVulnerable: boolean; // False during attack animation
    
    // Attack Pattern
    attackPhase: 'burst' | 'pause';
    burstShotsFired: number; // Tracks shots in current burst
    phaseCooldown: number; // Time until next phase change
    
    // Configuration
    burstShotCount: number; // Shots per burst (e.g., 5)
    burstShotInterval: number; // Time between burst shots (ms, e.g., 300)
    pauseDuration: number; // Time between bursts (ms, e.g., 2000)
    
    // Methods
    update(delta: number): void;
    shootProjectile(): IBossProjectile;
    takeDamage(amount: number): void;
    defeat(): void;
}
```

**Validation Rules**:
- Health must be between 0 and 10
- Takes exactly 1 damage per wizard staff hit
- Cannot take damage during attack animation (brief invulnerability)
- Boss dies when health reaches 0

**Attack Pattern**:
```
Phase 1: Burst (300ms intervals)
  → Fire 5 projectiles
  → Switch to Pause

Phase 2: Pause (2000ms)
  → No shooting
  → Switch to Burst

Repeat cycle until defeated
```

**State Transitions**:
```
[Alive, Burst] --5 shots fired--> [Alive, Pause]
[Alive, Pause] --2s elapsed--> [Alive, Burst]
[Alive] --health reaches 0--> [Defeated]
```

---

### Checkpoint

**Purpose**: Auto-save points that mark respawn locations

**TypeScript Interface**:
```typescript
interface ICheckpoint {
    // Transform
    position: { x: number; y: number };
    
    // State
    isActivated: boolean; // True once player passes
    
    // Visual
    flagRaised: boolean; // Matches isActivated for animation
    
    // Methods
    activate(): void;
}
```

**Validation Rules**:
- Once activated, remains activated for entire game session
- Player respawns at most recently activated checkpoint
- Must be manually placed in level data (total of 4 checkpoints)

**State Transitions**:
```
[Inactive] --player passes--> [Activated] (irreversible)
```

---

### Power-Up: Wizard Hat

**Purpose**: Collectible that grants shooting ability

**TypeScript Interface**:
```typescript
interface IPowerUpWizardHat {
    // Transform
    position: { x: number; y: number };
    spawnPosition: { x: number; y: number }; // Original location for respawn
    
    // State
    isCollected: boolean; // True when player has picked it up
    
    // Visual
    isVisible: boolean; // Hidden when collected
    
    // Methods
    collect(player: IPlayer): void;
    respawn(): void; // Called when player dies
}
```

**Validation Rules**:
- Only one wizard hat in level
- Disappears when collected
- Respawns at original position when player dies
- Player loses hat ability on death, must re-collect

**State Transitions**:
```
[Spawned] --player collects--> [Collected]
[Collected] --player dies--> [Spawned] (at original position)
```

---

### Collectible: Coin

**Purpose**: Score-tracking collectibles with no gameplay impact

**TypeScript Interface**:
```typescript
interface ICoin {
    // Transform
    position: { x: number; y: number };
    
    // State
    isCollected: boolean;
    
    // Methods
    collect(): void;
}
```

**Validation Rules**:
- Once collected, never respawns (even on player death)
- No effect on gameplay (purely score tracking)
- Distributed throughout level in level data JSON

---

### Platform

**Purpose**: Solid surfaces for player and enemy movement

**TypeScript Interface**:
```typescript
interface IPlatform {
    // Transform
    position: { x: number; y: number };
    width: number;
    height: number;
    
    // Type
    type: 'static' | 'moving';
    
    // Visual
    textureKey: string;
}

interface IMovingPlatform extends IPlatform {
    type: 'moving';
    
    // Movement
    path: Array<{ x: number; y: number }>; // Waypoints
    speed: number; // Pixels per second (slow, e.g., 50)
    currentWaypoint: number; // Index in path array
    
    // Visual Indicator
    pathIndicators: Array<{ x: number; y: number }>; // Dots showing path
    
    // Methods
    update(delta: number): void;
    moveToNextWaypoint(): void;
}
```

**Validation Rules**:
- Static platforms have fixed position (Phaser static bodies)
- Moving platforms follow predefined path at constant speed
- Path indicators must be visible to show platform trajectory
- Moving platforms can carry player (player position updates with platform)

---

### Projectile: Player (Wizard Staff)

**Purpose**: Light projectile shot by player when powered up

**TypeScript Interface**:
```typescript
interface IPlayerProjectile {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    
    // Configuration
    speed: number; // Pixels per second (e.g., 400)
    direction: 1 | -1; // Matches player facing direction
    
    // State
    isActive: boolean;
    
    // Lifecycle
    maxDistance: number; // Auto-destroy after traveling this far (e.g., 800px)
    traveledDistance: number;
    
    // Methods
    update(delta: number): void;
    destroy(): void;
}
```

**Validation Rules**:
- Player can only shoot once per second (rate limit)
- Projectile travels in straight line (no gravity)
- Destroys on contact with enemy or boss
- Auto-destroys after traveling maxDistance or leaving screen

---

### Projectile: Enemy (Bird Dropping)

**Purpose**: Hazardous droppings from birds

**TypeScript Interface**:
```typescript
interface IEnemyProjectile {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number }; // Only vertical (gravity)
    
    // State
    isActive: boolean;
    
    // Methods
    update(delta: number): void;
    destroy(): void; // On ground collision or player hit
}
```

**Validation Rules**:
- Affected by gravity (falls straight down)
- Destroys immediately upon landing on ground or platform
- Kills player on contact
- No horizontal movement

---

### Projectile: Boss

**Purpose**: Boss attack projectiles

**TypeScript Interface**:
```typescript
interface IBossProjectile {
    // Transform
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    
    // Configuration
    speed: number; // Pixels per second (e.g., 300)
    direction: { x: number; y: number }; // Normalized vector toward player
    
    // State
    isActive: boolean;
    
    // Methods
    update(delta: number): void;
    destroy(): void;
}
```

**Validation Rules**:
- Aimed at player position when fired
- Travels in straight line (no homing)
- Destroys on collision with player or wall
- Kills player on contact
- Does NOT collide with player projectiles (both pass through)

---

## Game State Management

### Game Session

**Purpose**: Overall game state and progression tracking

**TypeScript Interface**:
```typescript
interface IGameSession {
    // Player Progress
    lives: number; // 0-3
    coinsCollected: number;
    currentCheckpoint: ICheckpoint | null;
    
    // Timer
    gameStartTime: number; // Timestamp
    elapsedTime: number; // Milliseconds since start
    
    // Boss State
    bossDefeated: boolean;
    
    // Methods
    startGame(): void;
    updateTimer(): void;
    getFormattedTime(): string; // MM:SS format
    triggerVictory(): void;
    triggerGameOver(): void;
}
```

**Validation Rules**:
- Timer starts when gameplay begins (after main menu)
- Timer continues during pause (displays elapsed, not gameplay time)
- Timer stops on victory or game over
- Lives reset to 3 on new game
- Coins persist across deaths (collected coins stay collected)

---

### Level Data

**Purpose**: Static level configuration loaded from JSON

**TypeScript Interface**:
```typescript
interface ILevelData {
    // Metadata
    id: string;
    name: string;
    width: number; // Total level width in pixels
    height: number; // Level height in pixels
    
    // Environment
    background: string; // Texture key
    platforms: IPlatformData[];
    
    // Entities
    playerStart: { x: number; y: number };
    checkpoints: ICheckpointData[];
    enemies: IEnemyData[];
    coins: ICoinData[];
    powerUps: IPowerUpData[];
    
    // Boss
    bossArena: IBossArenaData;
}

interface IPlatformData {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'static' | 'moving';
    path?: Array<{ x: number; y: number }>; // For moving platforms
    speed?: number; // For moving platforms
}

interface ICheckpointData {
    x: number;
    y: number;
}

interface IEnemyData {
    type: 'bird' | 'shark';
    x: number;
    y: number;
    flyDirection?: -1 | 1; // For birds
    patrolStart?: number; // For sharks
    patrolEnd?: number; // For sharks
}

interface ICoinData {
    x: number;
    y: number;
}

interface IPowerUpData {
    type: 'wizard-hat';
    x: number;
    y: number;
}

interface IBossArenaData {
    x: number; // Left edge of arena
    y: number; // Top edge of arena
    width: number;
    height: number;
    bossPosition: { x: number; y: number };
}
```

**Loading Strategy**:
```typescript
// Load in Preload scene
this.load.json('level1', '/assets/level-data/level1.json');

// Parse in Game scene
const levelData: ILevelData = this.cache.json.get('level1');
```

---

### Save Data (LocalStorage)

**Purpose**: Persistent high scores and settings

**TypeScript Interface**:
```typescript
interface ISaveData {
    // High Scores
    bestTime: number | null; // Milliseconds, null if never completed
    totalCoinsCollected: number; // Across all playthroughs
    
    // Settings
    musicVolume: number; // 0.0 to 1.0
    sfxVolume: number; // 0.0 to 1.0
    isMusicMuted: boolean;
    
    // Methods
    save(): void;
    load(): ISaveData;
    updateBestTime(time: number): void;
}
```

**LocalStorage Schema**:
```typescript
// Key: 'le-monsters-save'
// Value: JSON string
{
    "bestTime": 245000, // 4:05 in milliseconds
    "totalCoinsCollected": 127,
    "musicVolume": 0.6,
    "sfxVolume": 0.8,
    "isMusicMuted": false
}
```

---

## Scene Data Flow

### Main Menu Scene
**Receives**: Save data (best time display)  
**Outputs**: Scene transition to Game Scene on "New Game"

### Game Scene
**Receives**: Level data JSON  
**Outputs**: 
- Victory scene (on boss defeat) with final time
- Game Over scene (on lives = 0) with final time

**Internal State**:
- Current game session (lives, coins, timer)
- Active entities (player, enemies, projectiles, collectibles)
- Current checkpoint reference

### Pause Scene
**Receives**: Game scene reference (to resume)  
**Outputs**: Resume or return to Main Menu

### Victory/Game Over Scenes
**Receives**: Final time, coins collected  
**Outputs**: Save data update (best time), return to Main Menu

---

## Physics Configuration

### Arcade Physics Settings
```typescript
const physicsConfig: Phaser.Types.Physics.Arcade.ArcadeWorldConfig = {
    gravity: { y: 800 }, // Downward gravity
    debug: false, // Set true for development
    fps: 60
};
```

### Collision Layers
```typescript
enum CollisionCategory {
    PLAYER = 0x0001,
    ENEMY = 0x0002,
    PLAYER_PROJECTILE = 0x0004,
    ENEMY_PROJECTILE = 0x0008,
    BOSS = 0x0010,
    PLATFORM = 0x0020,
    COLLECTIBLE = 0x0040
}
```

### Collision Matrix
| Entity | Collides With |
|--------|---------------|
| Player | Platform, Enemy, Enemy Projectile, Boss, Boss Projectile, Collectible (overlap) |
| Enemy | Platform, Player, Player Projectile |
| Boss | Player Projectile |
| Player Projectile | Enemy, Boss |
| Enemy Projectile | Player, Platform |
| Boss Projectile | Player, Platform |
| Collectible | None (overlap detection only) |

---

## Constants Configuration

**Game Constants** (`src/config/constants.ts`):
```typescript
export const GAME_CONFIG = {
    // Display
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,
    
    // Player
    PLAYER_SPEED: 200, // Max run speed
    PLAYER_JUMP_VELOCITY: -500, // Jump strength
    PLAYER_ACCELERATION: 600, // Acceleration/deceleration rate
    PLAYER_MAX_LIVES: 3,
    PLAYER_INVINCIBILITY_DURATION: 1000, // ms
    PLAYER_RESPAWN_DELAY: 2000, // ms
    
    // Shooting
    SHOOT_COOLDOWN: 1000, // ms
    PROJECTILE_SPEED: 400,
    PROJECTILE_MAX_DISTANCE: 800,
    
    // Enemies
    BIRD_FLY_SPEED: 100,
    BIRD_DROPPING_COOLDOWN_MIN: 2000, // ms
    BIRD_DROPPING_COOLDOWN_MAX: 5000, // ms
    SHARK_PATROL_SPEED: 80,
    
    // Boss
    BOSS_MAX_HEALTH: 10,
    BOSS_BURST_SHOT_COUNT: 5,
    BOSS_BURST_SHOT_INTERVAL: 300, // ms
    BOSS_PAUSE_DURATION: 2000, // ms
    BOSS_PROJECTILE_SPEED: 300,
    
    // Platforms
    MOVING_PLATFORM_SPEED: 50,
    
    // Physics
    GRAVITY: 800
};
```

---

## Data Validation

### Runtime Validation Functions
```typescript
// Player bounds checking
function isPositionValid(x: number, y: number, levelWidth: number, levelHeight: number): boolean {
    return x >= 0 && x <= levelWidth && y >= -100 && y <= levelHeight + 100;
}

// Lives validation
function isLivesValid(lives: number): boolean {
    return lives >= 0 && lives <= 3 && Number.isInteger(lives);
}

// Health validation
function isHealthValid(health: number, max: number): boolean {
    return health >= 0 && health <= max && Number.isInteger(health);
}
```

---

## Entity Relationships

```
GameSession
    ├── Player
    │   ├── hasWizardHat → PowerUpWizardHat (reference)
    │   ├── currentCheckpoint → Checkpoint (reference)
    │   └── shoots → PlayerProjectile[] (manages)
    │
    ├── Enemies
    │   ├── EnemyBird[]
    │   │   └── drops → EnemyProjectile[]
    │   └── EnemyShark[]
    │
    ├── Boss
    │   └── shoots → BossProjectile[]
    │
    ├── Checkpoints[]
    ├── Coins[]
    ├── PowerUps[]
    └── Platforms[]
```

---

**Data Model Complete**: 2025-10-31  
**Next**: Generate API contracts and interfaces
