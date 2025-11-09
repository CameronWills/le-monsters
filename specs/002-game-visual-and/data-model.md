# Data Model: Game Visual and Gameplay Enhancements

**Feature**: 002-game-visual-and  
**Date**: 2025-11-09  
**Purpose**: Define entity structures, state management, and data relationships for enhanced game elements

## Overview

This document defines the data structures for new and updated game entities, including scaled sprites, the new frog enemy, environmental layers (grass/water/clouds), moving platforms, and HUD elements. All entities maintain deterministic behavior for reliable gameplay.

---

## Entity Categories

### 1. Game Entities (Physics-Based)
Entities with collision, movement, and gameplay interaction logic.

### 2. Environmental Layers (Visual)
Non-interactive visual elements (grass, water, clouds) with animation.

### 3. HUD Elements (UI)
User interface components displaying game state.

### 4. Level Data (Configuration)
JSON-based level structure defining entity placement and properties.

---

## 1. Game Entities

### 1.1 Player (Hugo) - UPDATED

**Purpose**: Player-controlled character with scaled sprite and hitbox.

**Properties**:
```typescript
{
  id: string;                    // Unique identifier
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  scale: 1.2;                    // 120% visual scale
  hitbox: {
    width: number * 1.2;         // Scaled proportionally
    height: number * 1.2;
  };
  state: 'idle' | 'running' | 'jumping' | 'falling' | 'dead';
  facingDirection: 'left' | 'right';
  hasPowerUp: boolean;           // Wizard hat collected
  lives: number;                 // Remaining lives (max 3)
  invincible: boolean;           // Post-respawn invincibility
  invincibilityTimer: number;    // Duration remaining (ms)
}
```

**Validation Rules**:
- `scale` must be exactly 1.2
- `hitbox` dimensions must scale proportionally with visual sprite
- `lives` range: 0-3
- `invincibilityTimer` range: 0-1000ms

**State Transitions**:
- `idle` → `running`: Input detected
- `running` → `jumping`: Jump input while grounded
- `jumping` → `falling`: Upward velocity becomes downward
- `falling` → `idle/running`: Land on platform
- Any state → `dead`: Enemy collision or pit fall

---

### 1.2 EnemyFrog - NEW

**Purpose**: Ground-level jumping enemy with edge detection and player-tracking behavior.

**Properties**:
```typescript
{
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  scale: 1.2;
  hitbox: {
    width: number * 1.2;
    height: number * 1.2;
  };
  state: 'stationary' | 'jumping' | 'defeated';
  facingDirection: 'left' | 'right';
  jumpTimer: number;             // Time since last jump (ms)
  jumpInterval: 2000;            // Fixed 2-second interval
  jumpSpeed: number;             // Horizontal jump velocity
  jumpHeight: number;            // Vertical jump velocity
  platformEdgeDetection: {
    enabled: true;
    raycastDistance: 20;         // Pixels ahead to check
    raycastDepth: 50;            // Downward check distance
  };
  grounded: boolean;             // On platform vs airborne
}
```

**Validation Rules**:
- `jumpInterval` must be exactly 2000ms (non-configurable)
- `jumpSpeed` range: 50-150 px/s (short horizontal distance)
- `jumpHeight` range: -200 to -300 (low vertical jump)
- `raycastDistance` must detect edge before frog falls
- Spawn Y position must be on ground-level platforms only

**State Transitions**:
- `stationary` → `jumping`: jumpTimer >= 2000ms and player detected
- `jumping` → `stationary`: Land on platform
- Any state → `defeated`: Stomp or projectile hit

**Behavior Logic**:
```
Every 2 seconds (jumpTimer):
  1. Detect player X position
  2. Calculate jump direction (left or right toward player)
  3. Raycast ahead for platform edge
  4. If edge detected and pit beyond:
     - Set velocity to zero (stop at edge)
  5. Else:
     - Apply jump velocity toward player
     - Play jumping animation
```

---

### 1.3 Platform - UPDATED

**Purpose**: Static and moving platforms with scaled dimensions.

**Properties**:
```typescript
{
  id: string;
  position: { x: number; y: number };
  dimensions: {
    width: number * 1.2;
    height: number * 1.2;
  };
  scale: 1.2;
  type: 'static' | 'moving-vertical' | 'moving-horizontal';
  movement?: {                   // Only for moving platforms
    distance: number;            // Oscillation distance (px)
    speed: number;               // Movement speed (px/s)
    axis: 'x' | 'y';            // Horizontal or vertical
    startPosition: { x: number; y: number };
    currentDirection: 1 | -1;   // Forward or reverse
  };
  collidable: true;
}
```

**Validation Rules**:
- `scale` must be 1.2
- `type === 'static'` → `movement` must be undefined
- `type === 'moving-*'` → `movement` must be defined
- `movement.speed` range: 30-80 px/s (for predictable timing)
- `movement.distance` range: 50-200 px (reasonable oscillation)

**State Transitions** (Moving Platforms):
- Tween-based oscillation (no discrete states)
- Direction reverses at movement bounds automatically

---

### 1.4 EnemyProjectile (Bird Egg) - UPDATED

**Purpose**: Bird-dropped projectile with new egg visual at 1.5x scale.

**Properties**:
```typescript
{
  id: string;
  position: { x: number; y: number };
  velocity: { x: 0; y: number };  // Falls straight down
  scale: 1.5;                     // 150% of original dropping size
  hitbox: {
    width: number * 1.5;
    height: number * 1.5;
  };
  type: 'egg';                    // Changed from 'dropping'
  sprite: 'bird-egg';             // Oval, cream-colored
  lifetime: number;               // Distance fallen (px)
  maxLifetime: 2000;              // Destroy if exceeds (px)
  destroyOnGroundImpact: true;    // New behavior
}
```

**Validation Rules**:
- `scale` must be 1.5
- `velocity.x` must be 0 (no horizontal movement)
- `velocity.y` same as original dropping (maintain fall speed)
- `destroyOnGroundImpact` must be true

**State Transitions**:
- Active → Destroyed: Ground collision OR player collision OR max lifetime

---

### 1.5 Collectibles - UPDATED

All collectibles (Coin, Wizard Hat, Checkpoint) scaled to 120%.

**Common Properties**:
```typescript
{
  id: string;
  position: { x: number; y: number };
  scale: 1.2;
  hitbox: {
    width: number * 1.2;
    height: number * 1.2;
  };
  collected: boolean;
  respawnOnDeath: boolean;        // Reset when player dies
}
```

**Coin**:
- `respawnOnDeath`: true
- Increments coin counter by exactly 1

**Wizard Hat**:
- `respawnOnDeath`: true
- Grants player power-up (shooting ability)

**Checkpoint**:
- `respawnOnDeath`: false (stays raised)
- Triggers flag-raise animation on first pass
- Sets player respawn point

---

## 2. Environmental Layers

### 2.1 GrassLayer - NEW

**Purpose**: Animated grass overlay on ground surfaces.

**Properties**:
```typescript
{
  id: string;
  type: 'grass-layer';
  position: { x: number; y: number };  // Start position
  dimensions: {
    width: number;               // Tile width for coverage
    height: 30;                  // Fixed 30px thickness
  };
  animation: {
    frames: string[];            // ['grass-frame-1', 'grass-frame-2', ...]
    frameRate: 6;                // 6 fps for subtle waving
    loop: true;
  };
  depth: 5;                      // Render between ground and platforms
  tileSprite: boolean;           // Use TileSprite for seamless coverage
}
```

**Validation Rules**:
- `height` must be exactly 30 pixels
- `frameRate` range: 4-8 fps (subtle animation)
- Positioned at top edge of ground platforms only

**Rendering Strategy**:
- Use Phaser TileSprite for horizontal tiling
- Animation plays continuously (no state changes)

---

### 2.2 WaterHazard - NEW

**Purpose**: Animated water in pit areas (visual only, collision handled by pit bounds).

**Properties**:
```typescript
{
  id: string;
  type: 'water-hazard';
  position: { x: number; y: number };  // Pit start position
  dimensions: {
    width: number;               // Pit width
    height: number;              // Water depth (visual)
  };
  animation: {
    frames: string[];            // Water wave frames
    frameRate: 8;                // 8 fps for wave motion
    loop: true;
  };
  color: '#0077BE';              // Ocean blue
  depth: 1;                      // Behind all gameplay elements
}
```

**Validation Rules**:
- `color` must be ocean blue (#0077BE or similar)
- `frameRate` range: 6-10 fps (smooth wave motion)
- Positioned inside pit bounds defined in level data

**Rendering Strategy**:
- Animation plays continuously
- No collision logic (pits already handle death)

---

### 2.3 CloudLayer - NEW

**Purpose**: Parallax scrolling cloud background.

**Properties**:
```typescript
{
  id: string;
  type: 'cloud-layer';
  sprite: 'clouds';              // Cloud tile/sprite
  dimensions: {
    width: number;               // Tile width for coverage
    height: number;              // Vertical coverage
  };
  position: { x: 0; y: number };  // Y position in sky (high altitude)
  scrollFactor: 0.5;             // 50% of camera movement
  depth: 0;                      // Background layer (behind everything)
  tileSprite: boolean;           // Use TileSprite for infinite scroll
}
```

**Validation Rules**:
- `scrollFactor` must be exactly 0.5 (half camera speed)
- `depth` must be 0 (background)
- Positioned in upper portion of canvas (sky region)

**Rendering Strategy**:
- TileSprite with `tilePositionX` updated per frame
- `tilePositionX = cameraScrollX * scrollFactor`

---

## 3. HUD Elements

### 3.1 HUDLayout - UPDATED

**Purpose**: Reorganized HUD with scaled elements.

**Properties**:
```typescript
{
  scale: 1.2;                    // All elements 120% scaled
  layout: {
    lives: {
      position: { x: 50; y: 30 };         // Left side
      text: string;              // "Lives: {count}"
      icon?: string;             // Optional life icon
    };
    time: {
      position: { x: CANVAS_WIDTH / 2; y: 30 };  // Center
      text: string;              // "{minutes}:{seconds}" (no "Time:" prefix)
      format: 'MM:SS';
    };
    coins: {
      position: { x: CANVAS_WIDTH - 50; y: 30 }; // Right side
      text: string;              // "Coins: {count}"
      icon?: string;             // Optional coin icon
    };
  };
  font: {
    family: string;              // Consistent with hand-drawn aesthetic
    size: number * 1.2;          // Scaled font size
    color: string;
  };
}
```

**Validation Rules**:
- `scale` must be 1.2 for all elements
- `time.text` must NOT include "Time:" prefix
- Coin increment must be exactly 1 per collection

**Update Logic**:
- Lives: Update on player death or respawn
- Time: Update every second (formatted as MM:SS)
- Coins: Increment by 1 on collection (fix any existing multi-increment bug)

---

## 4. Level Data Structure

### 4.1 Extended Level JSON - UPDATED

**Purpose**: Extended level configuration with doubled length and new elements.

**Structure**:
```json
{
  "version": "2.0",
  "metadata": {
    "estimatedCompletionTime": "8-10 minutes",
    "checkpointCount": 4,
    "wizardHatCount": 3,
    "worldBounds": {
      "width": number,           // ~2x original width
      "height": number
    }
  },
  "platforms": [
    {
      "id": "platform-1",
      "x": number,
      "y": number,
      "width": number,
      "type": "static" | "moving-vertical" | "moving-horizontal",
      "movement": {              // Optional, for moving platforms
        "distance": number,
        "speed": number
      }
    }
  ],
  "pits": [
    {
      "id": "pit-1",
      "x": number,               // Start X
      "width": number,           // Pit width
      "hasWater": true           // Render water animation
    }
  ],
  "enemies": [
    {
      "id": "enemy-1",
      "type": "bird" | "shark" | "frog",
      "x": number,
      "y": number,
      "properties": {            // Type-specific config
        "patrolDistance"?: number,  // For sharks
        "spawnOnGround"?: boolean   // For frogs (must be true)
      }
    }
  ],
  "collectibles": {
    "coins": [
      { "id": "coin-1", "x": number, "y": number }
    ],
    "wizardHats": [
      { "id": "hat-1", "x": number, "y": number }
    ]
  },
  "checkpoints": [
    {
      "id": "checkpoint-1",
      "x": number,               // Spaced evenly across level
      "y": number
    }
  ],
  "grass": [
    {
      "startX": number,          // Start position for grass coverage
      "endX": number,            // End position
      "y": number                // Ground surface Y
    }
  ],
  "boss": {
    "x": number,                 // End of level
    "y": number
  }
}
```

**Validation Rules**:
- `checkpointCount` must be 4
- `wizardHatCount` must be 3 (last one after final checkpoint)
- Frog enemies must have `spawnOnGround: true` and Y position on ground level
- Level width must be approximately 2x original
- Moving platforms: 10-15 instances distributed throughout level

**Level Pacing Design**:
- **Section 1** (0-25%): Tutorial area (existing mechanics)
- **Section 2** (25-50%): Introduce frogs, increase enemy density
- **Section 3** (50-75%): Moving platforms, challenging pit sequences
- **Section 4** (75-100%): Final gauntlet, last checkpoint + wizard hat, boss arena

---

## 5. State Management

### 5.1 GameStateManager - UPDATED

**Purpose**: Track game state including defeated enemies and checkpoints.

**Properties**:
```typescript
{
  currentCheckpoint: {
    id: string;
    position: { x: number; y: number };
  };
  defeatedEnemies: Set<string>; // IDs of defeated enemies
  collectedItems: Set<string>;  // IDs of collected coins/hats
  playerState: {
    lives: number;
    coins: number;
    hasPowerUp: boolean;
  };
  bossState: {
    defeated: boolean;
    health: number;
  };
  timeElapsed: number;           // Seconds since level start
}
```

**Enemy Respawn Logic**:
```
On enemy defeat:
  defeatedEnemies.add(enemy.id)

On player death:
  defeatedEnemies.clear()
  Respawn all enemies at original positions
  
On enemy spawn attempt:
  if defeatedEnemies.has(enemy.id):
    Skip spawn (enemy already defeated)
```

**Validation Rules**:
- `defeatedEnemies` cleared only on player death (not checkpoint activation)
- `collectedItems` reset on player death (coins/hats respawn)
- `currentCheckpoint` updated when player passes checkpoint (one-time)

---

## 6. Entity Relationships

### Collision Matrix

| Entity | Player | Enemy | Enemy Projectile | Platform | Collectible | Boss |
|--------|--------|-------|-----------------|----------|-------------|------|
| **Player** | - | Death | Death | Land | Collect | No |
| **Player Projectile** | No | Defeat | No | No | No | Damage |
| **Enemy** | Death | No | No | Patrol Bounds | No | No |
| **Enemy Projectile** | Death | No | No | Destroy (egg) | No | No |
| **Platform** | Land | Patrol | Destroy | - | No | No |
| **Collectible** | Collect | No | No | No | - | No |
| **Boss** | Death | No | No | No | No | - |

### Entity Lifecycle

**Frog Enemy Lifecycle**:
1. Spawn at level start (from level JSON)
2. Enter stationary state
3. Timer triggers jump every 2 seconds
4. Check edge detection → jump or stop
5. Land → return to stationary
6. Defeated → destroyed, added to defeatedEnemies
7. Player death → respawn at original position

**Moving Platform Lifecycle**:
1. Spawn at level start
2. Initialize tween (oscillate between bounds)
3. Tween loops infinitely
4. Player death → tween continues (no reset needed)

**Environmental Layer Lifecycle**:
1. Created in GameScene initialization
2. Animations start on scene start
3. Loop infinitely
4. No state changes (visual only)

---

## 7. Performance Considerations

### Entity Pooling
- **Player Projectiles**: Pool of 50 (unchanged)
- **Enemy Projectiles**: Pool of 30 (unchanged, eggs reuse pool)
- **Boss Projectiles**: Pool of 20 (unchanged)

### Animation Optimization
- Grass/water animations: limit to visible screen area only (cull off-screen)
- Cloud TileSprite: single object (no pooling needed)
- Frog animation: 2 states only (minimize frame data)

### Memory Budget
- Scaled sprite sheets: +300KB
- New sprites (frog, grass, water, clouds, eggs): +230KB
- **Total**: ~530KB additional (within 2MB limit)

---

## 8. Data Validation Summary

All entities must satisfy these constraints:

1. **Scaling Consistency**: All gameplay entities scaled to 1.2, eggs to 1.5
2. **Hitbox Proportionality**: Collision boxes scale with visual sprites
3. **Deterministic Behavior**: No random timing (frog jumps every 2s, platform tweens predictable)
4. **Performance Budget**: Frame cost <3.1ms additional (see research.md)
5. **Asset Budget**: Total assets <2MB compressed
6. **Hand-Drawn Aesthetic**: All new sprites consistent with existing art style

---

## Conclusion

This data model defines all entity structures, state transitions, and relationships required for the game visual and gameplay enhancements. All entities are designed for deterministic behavior and performance within the 60 fps target.

**Next Step**: Generate contracts/ defining behavioral contracts for entity classes, scene management, and manager systems.
