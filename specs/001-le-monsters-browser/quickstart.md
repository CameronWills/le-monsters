# Developer Quickstart: Le Monsters Browser Game

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Tech Stack**: Phaser 3.70+ | Vite 5.x | TypeScript 5.x

## Prerequisites

- **Node.js**: v18.x or v20.x LTS
- **npm**: v9.x or v10.x (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with extensions below)

### Recommended VS Code Extensions

```bash
# Install via VS Code Extensions marketplace or CLI
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension gammasoft.phaser-3-snippets
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd le-monsters-browser
git checkout 001-le-monsters-browser
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- **phaser** (3.70+): Game engine
- **vite** (5.x): Build tool and dev server
- **typescript** (5.x): Type checker
- **vitest**: Unit testing framework
- **@playwright/test**: E2E testing
- **eslint** + **prettier**: Code quality tools

### 3. Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.x or v20.x

# Check npm version
npm --version   # Should be v9.x or v10.x

# List installed dependencies
npm list --depth=0
```

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:3000` with:
- **Hot Module Replacement (HMR)**: Instant updates on file save
- **TypeScript compilation**: Type checking in real-time
- **Asset serving**: Static files from `/public`

**Expected output**:
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open `http://localhost:3000` in Chrome, Firefox, Safari, or Edge.

### Project Structure

```
le-monsters-browser/
├── src/
│   ├── main.ts                 # Game entry point (Phaser config)
│   ├── config/
│   │   ├── constants.ts        # Game constants (speeds, physics, etc.)
│   │   └── phaser-config.ts    # Phaser game configuration
│   ├── scenes/
│   │   ├── BootScene.ts        # Initial boot and setup
│   │   ├── PreloadScene.ts     # Asset loading with progress bar
│   │   ├── MainMenuScene.ts    # Main menu UI
│   │   ├── GameScene.ts        # Core gameplay loop
│   │   ├── PauseScene.ts       # Pause menu overlay
│   │   ├── VictoryScene.ts     # Victory screen
│   │   ├── GameOverScene.ts    # Game over screen
│   │   └── AboutScene.ts       # About/credits screen
│   ├── entities/
│   │   ├── Player.ts           # Hugo (player character)
│   │   ├── EnemyBird.ts        # Flying bird enemy
│   │   ├── EnemyShark.ts       # Hovering shark enemy
│   │   ├── Boss.ts             # Final boss
│   │   ├── Checkpoint.ts       # Auto-save checkpoint
│   │   ├── Coin.ts             # Collectible coin
│   │   ├── PowerUpWizardHat.ts # Wizard hat power-up
│   │   ├── Platform.ts         # Static platform
│   │   ├── MovingPlatform.ts   # Moving platform
│   │   └── projectiles/
│   │       ├── PlayerProjectile.ts
│   │       ├── EnemyProjectile.ts
│   │       └── BossProjectile.ts
│   ├── managers/
│   │   ├── InputManager.ts     # Keyboard input handling
│   │   ├── AudioManager.ts     # Music and SFX
│   │   ├── GameStateManager.ts # Session state
│   │   ├── SaveDataManager.ts  # LocalStorage persistence
│   │   ├── LevelDataManager.ts # Level JSON loading
│   │   ├── HUDManager.ts       # Heads-up display
│   │   ├── CollisionManager.ts # Collision setup
│   │   ├── AnimationManager.ts # Animation registration
│   │   └── CameraManager.ts    # Camera control
│   ├── factories/
│   │   └── EntityFactory.ts    # Entity creation and pooling
│   └── types/
│       ├── entities.ts         # Entity interfaces
│       ├── scenes.ts           # Scene interfaces
│       └── managers.ts         # Manager interfaces
├── public/
│   └── assets/
│       ├── sprites/
│       │   ├── hugo.png        # Hugo sprite sheet
│       │   ├── enemies.png     # Enemy sprite sheet
│       │   ├── boss.png        # Boss sprite sheet
│       │   └── collectibles.png
│       ├── backgrounds/
│       │   └── forest-bg.png
│       ├── audio/
│       │   ├── music/
│       │   │   ├── gameplay.ogg
│       │   │   ├── boss.ogg
│       │   │   └── victory.ogg
│       │   └── sfx/
│       │       ├── jump.ogg
│       │       ├── shoot.ogg
│       │       └── collect-coin.ogg
│       └── level-data/
│           └── level1.json
├── tests/
│   ├── unit/
│   │   ├── entities/
│   │   ├── managers/
│   │   └── utils/
│   ├── integration/
│   │   └── scenes/
│   └── e2e/
│       ├── gameplay.spec.ts
│       ├── menus.spec.ts
│       └── boss-battle.spec.ts
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages deployment
│       └── test.yml            # CI testing
├── index.html                  # Entry HTML (loads main.ts)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.json              # ESLint rules
├── .prettierrc                 # Prettier formatting
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

---

## Development Commands

### Build & Serve

```bash
# Development server (HMR enabled)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Testing

```bash
# Run unit tests (Vitest)
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without building
npm run type-check
```

---

## Key Development Files

### 1. Game Entry Point (`src/main.ts`)

```typescript
import Phaser from 'phaser';
import { gameConfig } from './config/phaser-config';

// Create Phaser game instance
const game = new Phaser.Game(gameConfig);

// Expose for debugging (dev mode only)
if (import.meta.env.DEV) {
    (window as any).game = game;
}
```

### 2. Phaser Configuration (`src/config/phaser-config.ts`)

```typescript
import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';
// ... import other scenes

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // WebGL with Canvas fallback
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false // Set true to see collision boxes
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        GameScene,
        // ... other scenes
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 60,
        forceSetTimeOut: false
    }
};
```

### 3. Constants Configuration (`src/config/constants.ts`)

```typescript
export const GAME_CONFIG = {
    // Canvas
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,
    
    // Player
    PLAYER_SPEED: 200,
    PLAYER_JUMP_VELOCITY: -500,
    PLAYER_ACCELERATION: 600,
    PLAYER_MAX_LIVES: 3,
    PLAYER_INVINCIBILITY_DURATION: 1000,
    PLAYER_RESPAWN_DELAY: 2000,
    
    // Shooting
    SHOOT_COOLDOWN: 1000,
    PROJECTILE_SPEED: 400,
    PROJECTILE_MAX_DISTANCE: 800,
    
    // Enemies
    BIRD_FLY_SPEED: 100,
    BIRD_DROPPING_COOLDOWN_MIN: 2000,
    BIRD_DROPPING_COOLDOWN_MAX: 5000,
    SHARK_PATROL_SPEED: 80,
    
    // Boss
    BOSS_MAX_HEALTH: 10,
    BOSS_BURST_SHOT_COUNT: 5,
    BOSS_BURST_SHOT_INTERVAL: 300,
    BOSS_PAUSE_DURATION: 2000,
    BOSS_PROJECTILE_SPEED: 300,
    
    // Platforms
    MOVING_PLATFORM_SPEED: 50,
    
    // Physics
    GRAVITY: 800
};
```

---

## Adding New Assets

### 1. Sprite Sheets

Place sprite sheets in `public/assets/sprites/` and load in `PreloadScene`:

```typescript
// PreloadScene.ts
this.load.spritesheet('hugo', 'assets/sprites/hugo.png', {
    frameWidth: 64,
    frameHeight: 64
});
```

### 2. Audio Files

Place audio in `public/assets/audio/` (use OGG for best compression):

```typescript
// PreloadScene.ts
this.load.audio('jump', 'assets/audio/sfx/jump.ogg');
this.load.audio('gameplay-music', 'assets/audio/music/gameplay.ogg');
```

### 3. Level Data

Edit `public/assets/level-data/level1.json`:

```json
{
    "metadata": {
        "id": "level1",
        "name": "The Forest",
        "width": 3200,
        "height": 1080
    },
    "playerStart": { "x": 100, "y": 900 },
    "platforms": [
        { "x": 0, "y": 1000, "width": 3200, "height": 80, "type": "static" }
    ],
    "checkpoints": [
        { "x": 800, "y": 900 }
    ],
    "enemies": [
        { "type": "shark", "x": 500, "y": 950, "patrolStart": 400, "patrolEnd": 700 }
    ],
    "coins": [
        { "x": 400, "y": 850 }
    ],
    "powerUps": [
        { "type": "wizard-hat", "x": 1200, "y": 700 }
    ],
    "bossArena": {
        "x": 2800,
        "y": 400,
        "width": 400,
        "height": 600,
        "bossPosition": { "x": 3000, "y": 700 }
    }
}
```

---

## Debugging Tools

### Phaser Dev Tools

**Enable physics debug mode**:
```typescript
// src/config/phaser-config.ts
physics: {
    arcade: {
        debug: true // Shows collision boxes, velocities
    }
}
```

**Access game instance in console**:
```javascript
// Browser console (dev mode only)
window.game.scene.keys.GameScene // Access GameScene
window.game.loop.actualFps       // Check current FPS
```

### Browser DevTools

**Performance profiling**:
1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Record gameplay session
4. Analyze frame times (should be ~16ms for 60fps)

**Memory profiling**:
1. DevTools → "Memory" tab
2. Take heap snapshot before/after gameplay
3. Check for memory leaks (increasing memory usage)

---

## Common Development Tasks

### Creating a New Scene

1. Create scene file in `src/scenes/`:

```typescript
// src/scenes/CustomScene.ts
import Phaser from 'phaser';

export class CustomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CustomScene' });
    }
    
    init(data?: any) {
        // Initialize with data from previous scene
    }
    
    preload() {
        // Load scene-specific assets
    }
    
    create() {
        // Create game objects
    }
    
    update(time: number, delta: number) {
        // Update loop (60fps)
    }
    
    shutdown() {
        // Cleanup when scene stops
    }
}
```

2. Register in `src/config/phaser-config.ts`:

```typescript
import { CustomScene } from '../scenes/CustomScene';

scene: [
    BootScene,
    PreloadScene,
    CustomScene, // Add here
    // ...
]
```

### Creating a New Entity

1. Create entity file in `src/entities/`:

```typescript
// src/entities/CustomEntity.ts
import Phaser from 'phaser';
import { IEntity } from '../types/entities';

export class CustomEntity implements IEntity {
    sprite: Phaser.Physics.Arcade.Sprite;
    id: string;
    type = 'custom-entity';
    isActive = true;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.id = `custom-${Date.now()}`;
        this.sprite = scene.physics.add.sprite(x, y, 'custom-sprite');
        // Setup physics, animations, etc.
    }
    
    update(delta: number): void {
        // Update logic
    }
    
    destroy(): void {
        this.sprite.destroy();
        this.isActive = false;
    }
}
```

2. Add to `EntityFactory`:

```typescript
// src/factories/EntityFactory.ts
createCustomEntity(x: number, y: number): CustomEntity {
    return new CustomEntity(this.scene, x, y);
}
```

### Adding Unit Tests

```typescript
// tests/unit/entities/Player.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../../../src/entities/Player';

describe('Player', () => {
    let player: Player;
    
    beforeEach(() => {
        // Setup (mock Phaser scene if needed)
        player = new Player(mockScene, 100, 100);
    });
    
    it('should start with 3 lives', () => {
        expect(player.lives).toBe(3);
    });
    
    it('should lose a life when taking damage', () => {
        player.takeDamage();
        expect(player.lives).toBe(2);
    });
    
    it('should not shoot without wizard hat', () => {
        const projectile = player.shoot();
        expect(projectile).toBeNull();
    });
});
```

Run tests:
```bash
npm run test
```

---

## Performance Optimization Tips

### 1. Object Pooling
Reuse projectiles instead of creating/destroying:

```typescript
// EntityFactory.ts
private projectilePool: IPlayerProjectile[] = [];

createPlayerProjectile(x: number, y: number, direction: 1 | -1): IPlayerProjectile {
    // Get from pool if available
    const pooled = this.projectilePool.find(p => !p.isActive);
    if (pooled) {
        pooled.reset(x, y, direction);
        return pooled;
    }
    // Create new if pool empty
    return new PlayerProjectile(this.scene, x, y, direction);
}

recycleProjectile(projectile: IProjectile): void {
    projectile.isActive = false;
    // Keep in pool for reuse
}
```

### 2. Limit Update Calls
Only update active entities:

```typescript
update(delta: number): void {
    this.enemies.forEach(enemy => {
        if (enemy.isActive && enemy.sprite.visible) {
            enemy.update(delta);
        }
    });
}
```

### 3. Use Texture Atlases
Combine sprites into single atlas:

```bash
# Use TexturePacker or similar tool
texturepacker sprites/*.png --data sprites-atlas.json --format phaser3
```

### 4. Monitor FPS
Add FPS counter in dev mode:

```typescript
// GameScene.ts
create() {
    if (import.meta.env.DEV) {
        this.fpsText = this.add.text(10, 10, '', { font: '16px Arial' });
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
            },
            loop: true
        });
    }
}
```

---

## Deployment

### GitHub Pages

1. Build production bundle:
```bash
npm run build
```

2. Deploy to GitHub Pages (automated via GitHub Actions):
```yaml
# .github/workflows/deploy.yml already configured
# Push to main branch triggers deployment
```

3. Access at: `https://<username>.github.io/<repo-name>/`

### Netlify

1. Connect repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Deploy automatically on push

---

## Troubleshooting

### Vite Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 3000 is not in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.vite
```

### Assets Not Loading
- Ensure files are in `/public` directory
- Check file paths match exactly (case-sensitive)
- Verify asset loading in PreloadScene
- Check browser console for 404 errors

### Physics Issues
- Enable debug mode: `physics.arcade.debug = true`
- Check collision boxes are correct size
- Verify physics bodies are added to groups

---

## Next Steps

1. ✅ Clone repository and install dependencies
2. ✅ Run `npm run dev` and verify game loads
3. ✅ Review project structure and key files
4. ✅ Read contracts in `specs/001-le-monsters-browser/contracts/`
5. ✅ Check data model in `specs/001-le-monsters-browser/data-model.md`
6. ✅ Start implementing scenes and entities
7. ✅ Write tests as you build features
8. ✅ Monitor performance (60fps target)

**Happy coding!** 🎮

---

**Quickstart Guide Complete**: 2025-10-31  
**Ready for development**: Phase 2 implementation
