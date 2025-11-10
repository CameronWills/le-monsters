# Quickstart: Game Visual and Gameplay Enhancements

**Feature**: 002-game-visual-and  
**Date**: 2025-11-09  
**Purpose**: Developer setup and implementation guide

## Overview

This guide provides step-by-step instructions for implementing the game visual and gameplay enhancements feature, including sprite scaling, new frog enemy, environmental graphics, extended level design, and HUD improvements.

---

## Prerequisites

### Development Environment
- Node.js >= 18.0.0
- npm >= 9.0.0
- VS Code (recommended) or similar editor
- Chrome browser (latest) for testing

### Project Setup
```bash
# Clone repository (if not already done)
git clone <repository-url>
cd playground

# Install dependencies
npm install

# Verify setup
npm run dev  # Should start dev server on localhost:5173
```

### Required Knowledge
- TypeScript fundamentals
- Phaser 3 game framework basics
- Sprite sheet animation concepts
- JSON data structures
- Git version control

---

## Implementation Roadmap

### Phase 1: Asset Preparation (Day 1-2)
1. Create scaled sprite sheets at 120%
2. Design frog enemy sprites (stationary, jumping)
3. Create grass animation frames (30px tall, waving motion)
4. Create water animation frames (wave motion)
5. Create cloud sprite for parallax background
6. Create bird egg sprite (oval, cream, 1.5x original)
7. Record audio files (frog jump, frog defeat, egg impact)

### Phase 2: Core Systems (Day 3-5)
1. Update constants for scaling and frog behavior
2. Implement EnemyFrog class with jump AI and edge detection
3. Update Platform class for moving platforms
4. Update EnemyProjectile for egg visual
5. Update environmental layer classes (GrassLayer, WaterHazard, CloudLayer)
6. Update HUDManager for layout and scaling

### Phase 3: Level Extension (Day 6-7)
1. Design extended level1.json (2x length)
2. Place 4 checkpoints evenly
3. Place 3 wizard hats (last after final checkpoint)
4. Add moving platforms (vertical and horizontal)
5. Add frog enemy spawn points (ground-level only)
6. Add grass layer definitions
7. Add water hazard definitions (in pits)

### Phase 4: Integration & Testing (Day 8-10)
1. Update GameScene for entity spawning and layers
2. Update PreloadScene for new assets
3. Update AnimationManager for new animations
4. Update AudioManager for new SFX
5. Update GameStateManager for enemy respawn logic
6. Write unit tests for new entities and managers
7. Write E2E tests for visual regression and performance
8. Manual playtesting and performance profiling

---

## Step-by-Step Implementation

### 1. Update Constants

**File**: `src/config/constants.ts`

```typescript
// Add new constants for frog enemy
export const GAME_CONFIG = {
  // ...existing constants
  
  // === Frog Enemy (NEW) ===
  FROG_JUMP_INTERVAL: 2000,        // milliseconds between jumps
  FROG_JUMP_SPEED: 100,            // horizontal jump speed (px/s)
  FROG_JUMP_HEIGHT: -250,          // vertical jump velocity (negative = upward)
  FROG_EDGE_CHECK_DISTANCE: 20,   // pixels ahead to check for platform edge
  
  // === Scaling (NEW) ===
  SPRITE_SCALE: 1.2,               // 120% scale for most entities
  EGG_SCALE: 1.5,                  // 150% scale for bird eggs
  
  // === Environmental (NEW) ===
  GRASS_HEIGHT: 30,                // pixels
  CLOUD_SCROLL_FACTOR: 0.5,        // 50% of camera speed
} as const;

// Add new animation keys
export const ANIM_KEYS = {
  // ...existing keys
  
  ENEMIES: {
    // ...existing enemy animations
    FROG_STATIONARY: 'frog-stationary',
    FROG_JUMPING: 'frog-jumping',
  },
  
  ENVIRONMENTAL: {
    GRASS_WAVE: 'grass-wave',
    WATER_WAVE: 'water-wave',
  },
} as const;

// Add new sprite keys
export const SPRITE_KEYS = {
  // ...existing keys
  FROG: 'frog',
  GRASS: 'grass-layer',
  WATER: 'water-animation',
  CLOUDS: 'clouds',
  BIRD_EGG: 'bird-egg',
} as const;

// Add new audio keys
export const AUDIO_KEYS = {
  // ...existing keys
  SFX: {
    // ...existing SFX
    FROG_JUMP: 'sfx-frog-jump',
    FROG_DEFEAT: 'sfx-frog-defeat',
    EGG_IMPACT: 'sfx-egg-impact',
  },
} as const;
```

---

### 2. Create EnemyFrog Class

**File**: `src/entities/EnemyFrog.ts`

```typescript
import Phaser from 'phaser';
import { GAME_CONFIG, ANIM_KEYS, DEPTHS } from '../config/constants';

export class EnemyFrog extends Phaser.Physics.Arcade.Sprite {
  private jumpTimer: number = 0;
  private jumpInterval: number = GAME_CONFIG.FROG_JUMP_INTERVAL;
  private facingRight: boolean = true;
  private grounded: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'frog');
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Apply scaling
    this.setScale(GAME_CONFIG.SPRITE_SCALE);
    
    // Configure physics
    this.body.setCollideWorldBounds(true);
    this.body.setGravityY(GAME_CONFIG.GRAVITY);
    
    // Set depth
    this.setDepth(DEPTHS.ENEMIES);
    
    // Start with stationary animation
    this.play(ANIM_KEYS.ENEMIES.FROG_STATIONARY);
  }

  update(time: number, delta: number, player: Phaser.GameObjects.GameObject): void {
    // Check if grounded
    this.grounded = this.body.touching.down;
    
    // Increment jump timer
    this.jumpTimer += delta;
    
    // Perform jump if timer exceeded and grounded
    if (this.grounded && this.jumpTimer >= this.jumpInterval) {
      this.performJump(player as Phaser.Physics.Arcade.Sprite);
      this.jumpTimer = 0;
    }
    
    // Return to stationary animation when landing
    if (this.grounded && this.anims.currentAnim?.key === ANIM_KEYS.ENEMIES.FROG_JUMPING) {
      this.play(ANIM_KEYS.ENEMIES.FROG_STATIONARY);
    }
  }

  private performJump(player: Phaser.Physics.Arcade.Sprite): void {
    // Determine direction toward player
    const direction = player.x > this.x ? 1 : -1;
    this.facingRight = direction === 1;
    this.setFlipX(!this.facingRight);
    
    // Check for platform edge
    if (this.checkPlatformEdge(direction)) {
      // Edge detected - stop at edge
      this.setVelocityX(0);
      return;
    }
    
    // Perform jump
    this.setVelocity(
      direction * GAME_CONFIG.FROG_JUMP_SPEED,
      GAME_CONFIG.FROG_JUMP_HEIGHT
    );
    
    // Play jumping animation
    this.play(ANIM_KEYS.ENEMIES.FROG_JUMPING);
    
    // Play jump SFX
    this.scene.sound.play(AUDIO_KEYS.SFX.FROG_JUMP);
  }

  private checkPlatformEdge(direction: number): boolean {
    // Raycast ahead to detect platform edge
    const checkDistance = GAME_CONFIG.FROG_EDGE_CHECK_DISTANCE;
    const rayOrigin = {
      x: this.x + (direction * checkDistance),
      y: this.y,
    };
    
    // Check if there's ground ahead (simplified - actual implementation needs proper raycast)
    // This is a placeholder - implement proper tile/platform detection
    const tile = this.scene.physics.world.getTileAtWorldXY(rayOrigin.x, rayOrigin.y + 50);
    return !tile; // No tile = edge detected
  }

  onDefeated(): void {
    // Play defeat animation and SFX
    this.scene.sound.play(AUDIO_KEYS.SFX.FROG_DEFEAT);
    
    // Add to defeated enemies list
    // (GameStateManager integration)
    
    // Destroy after brief delay
    this.scene.time.delayedCall(500, () => {
      this.destroy();
    });
  }
}
```

**Note**: The `checkPlatformEdge()` method needs proper implementation based on your platform/tile system. This is a simplified placeholder.

---

### 3. Update PreloadScene

**File**: `src/scenes/PreloadScene.ts`

Add new asset loading in the `preload()` method:

```typescript
preload(): void {
  // ...existing asset loading
  
  // Load scaled sprites (if using separate scaled sprite sheets)
  this.load.spritesheet('hugo-120', 'assets/sprites/hugo-120.png', {
    frameWidth: originalWidth * 1.2,
    frameHeight: originalHeight * 1.2,
  });
  
  // Load frog enemy sprites
  this.load.spritesheet('frog', 'assets/sprites/frog.png', {
    frameWidth: frogWidth,
    frameHeight: frogHeight,
  });
  
  // Load environmental graphics
  this.load.spritesheet('grass-layer', 'assets/sprites/grass-layer.png', {
    frameWidth: grassTileWidth,
    frameHeight: 30,
  });
  
  this.load.spritesheet('water-animation', 'assets/sprites/water-animation.png', {
    frameWidth: waterFrameWidth,
    frameHeight: waterFrameHeight,
  });
  
  this.load.image('clouds', 'assets/backgrounds/clouds.png');
  
  // Load bird egg sprite
  this.load.spritesheet('bird-egg', 'assets/sprites/bird-egg.png', {
    frameWidth: eggWidth,
    frameHeight: eggHeight,
  });
  
  // Load new audio
  this.load.audio('sfx-frog-jump', 'assets/audio/sfx/frog-jump.ogg');
  this.load.audio('sfx-frog-defeat', 'assets/audio/sfx/frog-defeat.ogg');
  this.load.audio('sfx-egg-impact', 'assets/audio/sfx/egg-impact.ogg');
  
  // Load extended level data
  this.load.json('level1', 'assets/level-data/level1.json');
}
```

---

### 4. Update AnimationManager

**File**: `src/managers/AnimationManager.ts`

Add new animation creation methods:

```typescript
createAnimations(scene: Phaser.Scene): void {
  // ...existing animations
  
  this.createFrogAnimations(scene);
  this.createEnvironmentalAnimations(scene);
  this.createEggAnimation(scene);
}

private createFrogAnimations(scene: Phaser.Scene): void {
  // Stationary animation
  scene.anims.create({
    key: ANIM_KEYS.ENEMIES.FROG_STATIONARY,
    frames: scene.anims.generateFrameNumbers('frog', { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1,
  });
  
  // Jumping animation
  scene.anims.create({
    key: ANIM_KEYS.ENEMIES.FROG_JUMPING,
    frames: scene.anims.generateFrameNumbers('frog', { start: 2, end: 5 }),
    frameRate: 10,
    repeat: 0,
  });
}

private createEnvironmentalAnimations(scene: Phaser.Scene): void {
  // Grass waving animation
  scene.anims.create({
    key: ANIM_KEYS.ENVIRONMENTAL.GRASS_WAVE,
    frames: scene.anims.generateFrameNumbers('grass-layer', { start: 0, end: 5 }),
    frameRate: 6,
    repeat: -1,
    yoyo: true,
  });
  
  // Water wave animation
  scene.anims.create({
    key: ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE,
    frames: scene.anims.generateFrameNumbers('water-animation', { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1,
  });
}

private createEggAnimation(scene: Phaser.Scene): void {
  scene.anims.create({
    key: 'bird-egg-fall',
    frames: scene.anims.generateFrameNumbers('bird-egg', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
}
```

---

### 5. Update HUDManager

**File**: `src/managers/HUDManager.ts`

Update layout and scaling:

```typescript
create(scene: Phaser.Scene): void {
  const { CANVAS_WIDTH } = GAME_CONFIG;
  
  // Lives display (left)
  this.livesText = scene.add.text(50, 30, 'Lives: 3', {
    fontSize: '24px',
    color: '#ffffff',
  });
  this.livesText.setScale(GAME_CONFIG.SPRITE_SCALE);
  this.livesText.setScrollFactor(0);
  this.livesText.setDepth(DEPTHS.HUD);
  
  // Time display (center, no "Time:" prefix)
  this.timeText = scene.add.text(CANVAS_WIDTH / 2, 30, '00:00', {
    fontSize: '24px',
    color: '#ffffff',
  });
  this.timeText.setScale(GAME_CONFIG.SPRITE_SCALE);
  this.timeText.setOrigin(0.5, 0); // Center alignment
  this.timeText.setScrollFactor(0);
  this.timeText.setDepth(DEPTHS.HUD);
  
  // Coins display (right)
  this.coinsText = scene.add.text(CANVAS_WIDTH - 50, 30, 'Coins: 0', {
    fontSize: '24px',
    color: '#ffffff',
  });
  this.coinsText.setScale(GAME_CONFIG.SPRITE_SCALE);
  this.coinsText.setOrigin(1, 0); // Right alignment
  this.coinsText.setScrollFactor(0);
  this.coinsText.setDepth(DEPTHS.HUD);
}

updateTime(seconds: number): void {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  // Format as MM:SS with leading zeros
  const timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  this.timeText.setText(timeString);
}

updateCoins(coins: number): void {
  this.coinsText.setText(`Coins: ${coins}`);
  
  // Brief scale pulse animation
  this.coinsText.setScale(GAME_CONFIG.SPRITE_SCALE * 1.2);
  this.scene.tweens.add({
    targets: this.coinsText,
    scale: GAME_CONFIG.SPRITE_SCALE,
    duration: 200,
    ease: 'Back.easeOut',
  });
}
```

---

### 6. Extend Level Data

**File**: `public/assets/level-data/level1.json`

Structure for extended level (example):

```json
{
  "version": "2.0",
  "metadata": {
    "estimatedCompletionTime": "8-10 minutes",
    "checkpointCount": 4,
    "wizardHatCount": 3,
    "worldBounds": {
      "width": 12000,
      "height": 1080
    }
  },
  "platforms": [
    { "id": "platform-1", "x": 0, "y": 950, "width": 1920, "type": "static" },
    { "id": "platform-2", "x": 2000, "y": 800, "width": 300, "type": "moving-vertical", "movement": { "distance": 100, "speed": 50 } },
    { "id": "platform-3", "x": 3000, "y": 750, "width": 250, "type": "moving-horizontal", "movement": { "distance": 150, "speed": 60 } }
    // ...many more platforms
  ],
  "pits": [
    { "id": "pit-1", "x": 1920, "width": 200, "hasWater": true },
    { "id": "pit-2", "x": 4000, "width": 300, "hasWater": true }
    // ...more pits
  ],
  "enemies": [
    { "id": "bird-1", "type": "bird", "x": 500, "y": 300 },
    { "id": "shark-1", "type": "shark", "x": 800, "y": 900 },
    { "id": "frog-1", "type": "frog", "x": 1200, "y": 950 },
    { "id": "frog-2", "type": "frog", "x": 3500, "y": 950 }
    // ...more enemies
  ],
  "collectibles": {
    "coins": [
      { "id": "coin-1", "x": 400, "y": 850 },
      { "id": "coin-2", "x": 600, "y": 800 }
      // ...many more coins
    ],
    "wizardHats": [
      { "id": "hat-1", "x": 2500, "y": 700 },
      { "id": "hat-2", "x": 6000, "y": 650 },
      { "id": "hat-3", "x": 10500, "y": 800 }
    ]
  },
  "checkpoints": [
    { "id": "checkpoint-1", "x": 3000, "y": 950 },
    { "id": "checkpoint-2", "x": 6000, "y": 950 },
    { "id": "checkpoint-3", "x": 9000, "y": 950 },
    { "id": "checkpoint-4", "x": 11000, "y": 950 }
  ],
  "grass": [
    { "startX": 0, "endX": 1920, "y": 920 },
    { "startX": 2200, "endX": 4000, "y": 920 }
    // ...more grass sections
  ],
  "boss": {
    "x": 11500,
    "y": 800
  }
}
```

---

### 7. Update GameScene

**File**: `src/scenes/GameScene.ts`

Major updates for entity spawning and layers:

```typescript
create(): void {
  // 1. Initialize managers
  this.initializeManagers();
  
  // 2. Load level data
  this.levelData = this.cache.json.get('level1');
  this.validateLevel(this.levelData);
  
  // 3. Setup environmental layers
  this.setupEnvironmentalLayers();
  
  // 4. Spawn platforms
  this.spawnPlatforms();
  
  // 5. Spawn enemies
  this.spawnEnemies();
  
  // 6. Spawn collectibles
  this.spawnCollectibles();
  
  // 7. Spawn player
  this.spawnPlayer();
  
  // 8. Setup collisions
  this.setupCollisions();
  
  // 9. Setup camera
  this.setupCamera();
  
  // 10. Start music
  this.audioManager.playMusic('music-gameplay', true);
  
  // 11. Create HUD
  this.hudManager.create(this);
}

private setupEnvironmentalLayers(): void {
  // Create cloud layer (background)
  this.cloudLayer = this.add.tileSprite(0, 0, this.levelData.metadata.worldBounds.width, 500, 'clouds');
  this.cloudLayer.setOrigin(0, 0);
  this.cloudLayer.setDepth(DEPTHS.BACKGROUND);
  this.cloudLayer.setScrollFactor(GAME_CONFIG.CLOUD_SCROLL_FACTOR);
  
  // Create water hazards in pits
  this.waterHazards = this.add.group();
  this.levelData.pits.forEach(pit => {
    if (pit.hasWater) {
      const water = this.add.sprite(pit.x, 1000, 'water-animation');
      water.setOrigin(0, 0);
      water.setDisplaySize(pit.width, 80);
      water.setDepth(1);
      water.play(ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE);
      this.waterHazards.add(water);
    }
  });
  
  // Create grass layers on ground surfaces
  this.grassLayers = this.add.group();
  this.levelData.grass.forEach(grassSection => {
    const grassWidth = grassSection.endX - grassSection.startX;
    const grass = this.add.tileSprite(grassSection.startX, grassSection.y, grassWidth, 30, 'grass-layer');
    grass.setOrigin(0, 0);
    grass.setDepth(5);
    grass.play(ANIM_KEYS.ENVIRONMENTAL.GRASS_WAVE);
    this.grassLayers.add(grass);
  });
}

private spawnEnemies(): void {
  this.enemies = this.add.group();
  
  this.levelData.enemies.forEach(enemyData => {
    // Check if already defeated
    if (this.gameStateManager.isEnemyDefeated(enemyData.id)) {
      return;
    }
    
    let enemy;
    switch (enemyData.type) {
      case 'frog':
        enemy = new EnemyFrog(this, enemyData.x, enemyData.y);
        break;
      // ...other enemy types
    }
    
    if (enemy) {
      this.enemies.add(enemy);
    }
  });
}

update(time: number, delta: number): void {
  // Update managers
  this.inputManager.update();
  this.gameStateManager.update(delta);
  this.hudManager.update(time, delta);
  
  // Update player
  this.player.update(time, delta);
  
  // Update enemies
  this.enemies.children.entries.forEach((enemy: EnemyFrog) => {
    enemy.update(time, delta, this.player);
  });
  
  // Update cloud parallax
  this.cloudLayer.tilePositionX = this.cameras.main.scrollX * GAME_CONFIG.CLOUD_SCROLL_FACTOR;
  
  // Check win/lose conditions
  this.checkGameConditions();
}
```

---

## Testing Checklist

### Unit Tests
- [ ] EnemyFrog jump timing (every 2 seconds)
- [ ] EnemyFrog edge detection (stops at platform edges)
- [ ] Platform moving logic (tween oscillation)
- [ ] HUDManager layout positions (lives left, time center, coins right)
- [ ] HUDManager time formatting (MM:SS, no prefix)
- [ ] GameStateManager enemy respawn tracking
- [ ] Coin collection increments by exactly 1

### Integration Tests
- [ ] Level data loads successfully
- [ ] All entities spawn at correct positions
- [ ] Scaled sprites render at 120% (visual verification)
- [ ] Environmental layers render in correct depth order
- [ ] Collision handlers trigger correctly

### E2E Tests
- [ ] Visual regression: scaled sprites match specification
- [ ] Performance: maintains 60 fps with all enhancements
- [ ] Gameplay flow: 8-10 minute completion time
- [ ] Checkpoint spacing: 4 evenly distributed
- [ ] Wizard hat placement: 3 total, last before boss

### Manual Testing
- [ ] Playtest full level start to finish
- [ ] Verify frog enemy behavior (jump toward player, stop at edges)
- [ ] Verify parallax clouds (move at half speed)
- [ ] Verify grass/water animations (smooth, consistent)
- [ ] Verify HUD layout (correct positions, readable at 120% scale)
- [ ] Test on target hardware (standard laptop, Chrome browser)

---

## Common Pitfalls

### Asset Scaling Issues
- **Problem**: Sprites look blurry at 120% scale
- **Solution**: Ensure `pixelArt: true` in Phaser config, pre-scale sprite sheets using nearest-neighbor interpolation

### Performance Degradation
- **Problem**: Frame rate drops below 60 fps
- **Solution**: Profile with Chrome DevTools, cull off-screen animations, reduce moving platform count

### Frog Edge Detection Failing
- **Problem**: Frogs fall into pits despite edge detection
- **Solution**: Increase `FROG_EDGE_CHECK_DISTANCE`, verify raycast implementation matches platform system

### Coin Counter Bug
- **Problem**: Coins increment by more than 1
- **Solution**: Ensure `incrementCoins()` only accepts `amount === 1`, check for duplicate collision handlers

### Level Too Long/Short
- **Problem**: Completion time outside 8-10 minute range
- **Solution**: Adjust platform spacing, enemy density, or level length; playtest with target age group

---

## Debugging Tips

### Enable Phaser Debug Mode
```typescript
// In phaser-config.ts
physics: {
  default: 'arcade',
  arcade: {
    debug: true,  // Shows collision boxes, velocities
  },
},
```

### Log Entity Spawning
```typescript
console.log(`Spawned ${enemyData.type} at (${enemyData.x}, ${enemyData.y})`);
```

### Profile Performance
```typescript
// In GameScene.update()
const start = performance.now();
// ...entity updates
const end = performance.now();
console.log(`Update time: ${end - start}ms`);
```

### Visualize Level Layout
Use a tool like Tiled Map Editor to visualize `level1.json` structure before implementation.

---

## Next Steps

After completing implementation:

1. **Run Tests**: `npm run test` for unit tests, `npm run test:e2e` for E2E tests
2. **Profile Performance**: Use Chrome DevTools Performance tab, target 60 fps
3. **Playtest**: Get feedback from target age group (7-8 year olds) or proxy
4. **Polish**: Adjust animations, sounds, difficulty based on feedback
5. **Document**: Update README with feature changes

**Phase 2 (Tasks)**: Use `/speckit.tasks` command to generate detailed task breakdown for implementation tracking.

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/](./contracts/)
- **Phaser 3 Docs**: https://photonstorm.github.io/phaser3-docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
