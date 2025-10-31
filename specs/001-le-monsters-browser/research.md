# Research: Le Monsters Browser Game

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Purpose**: Document technology decisions, best practices, and architectural patterns

## Technology Stack Decisions

### Decision: Phaser 3.70+ as Game Engine
**Rationale**:
- Battle-tested HTML5 game engine with strong TypeScript support
- Built-in Scene system aligns perfectly with menu/gameplay/pause state management
- Excellent physics engine (Arcade Physics) provides deterministic collision detection
- LoaderPlugin handles asset loading with progress tracking and caching
- Active community and extensive documentation for 2D platformers
- WebGL + Canvas fallback ensures 60fps on target hardware

**Alternatives Considered**:
- **PixiJS**: Lower-level renderer without built-in physics or scene management (would require additional libraries)
- **Three.js**: 3D-focused, overkill for 2D platformer
- **Vanilla Canvas API**: Would require building physics, animation, and scene systems from scratch
- **Godot Web Export**: Heavier bundle size, less mature web export than native web technologies

### Decision: Vite 5.x as Build Tool
**Rationale**:
- Native ES modules for instant HMR during development (sub-100ms rebuilds)
- Optimized production builds with automatic code splitting
- Simple configuration for TypeScript + asset handling
- Built-in dev server with CORS support for local asset testing
- Plugin ecosystem for sprite sheet optimization and asset fingerprinting
- Smaller, faster alternative to Webpack for client-side projects

**Alternatives Considered**:
- **Webpack**: More complex configuration, slower dev builds
- **Parcel**: Less explicit control over optimization strategies
- **Rollup**: Great for libraries, less dev-server features than Vite

### Decision: TypeScript 5.x Strict Mode
**Rationale**:
- Catch collision detection bugs and null references at compile time
- Strong typing for Phaser's complex API surface (Scene lifecycle, Game Objects)
- Improved IDE autocomplete for game entity properties and methods
- Easier refactoring when iterating on game mechanics
- Strict mode prevents common JavaScript pitfalls (implicit any, undefined checks)

**Alternatives Considered**:
- **JavaScript**: Faster initial prototyping but higher bug rate in physics/collision code
- **TypeScript with loose mode**: Defeats the purpose of type safety

### Decision: Vitest for Unit Testing
**Rationale**:
- Native Vite integration (uses same config and transforms)
- Fast parallel test execution with module mocking
- Compatible with Phaser's browser APIs when combined with jsdom
- Ideal for testing game logic (score calculation, state transitions, collision math)
- Familiar Jest-like API reduces learning curve

**Alternatives Considered**:
- **Jest**: Requires additional TypeScript and ESM configuration with Vite
- **Mocha/Chai**: Less integrated with Vite, manual mocking setup

### Decision: Playwright for E2E Testing
**Rationale**:
- Headless browser automation for testing full game scenarios
- Can verify user stories (load game → collect coin → lives decrease on death)
- Screenshot comparison for visual regression testing
- Reliable for timing-sensitive interactions (jump timing, collision detection)
- Better performance profiling than Cypress

**Alternatives Considered**:
- **Cypress**: Slower, runs in same context as app (potential timing interference)
- **Puppeteer**: Lower-level API, more manual setup

### Decision: LocalStorage API for Persistence
**Rationale**:
- Zero backend complexity (client-side only requirement met)
- Synchronous API suitable for small data (high scores, settings)
- Persists across browser sessions for best times tracking
- Built-in browser support, no polyfills needed

**Alternatives Considered**:
- **IndexedDB**: Async API overkill for simple key-value storage
- **Cookies**: Size limitations, sent with every request (unnecessary overhead)

## Best Practices Research

### Phaser 3 Scene Architecture
**Pattern**: Scene-per-screen with shared Registry for global state

**Implementation**:
```
Boot Scene → Preload Scene → MainMenu Scene → Game Scene → Victory/GameOver Scenes
                                    ↓                ↓
                              Pause Scene      Boss Fight (sub-state in Game Scene)
```

**Best Practices**:
- Use `scene.registry` for cross-scene data (lives, coins, checkpoint)
- Avoid singleton game state; let Scenes own their data
- Implement `create()`, `update()`, `shutdown()` lifecycle carefully
- Use `scene.launch()` for overlays (pause menu) instead of switching scenes
- Physics groups for entity management (enemiesGroup, coinsGroup)

### Asset Loading Strategy
**Pattern**: Centralized preloader with progress tracking

**File Structure**:
```
public/assets/
├── sprites/
│   ├── hugo.png (sprite sheet)
│   ├── enemies.png (sprite sheet)
│   └── boss.png (sprite sheet)
├── backgrounds/
│   └── level1-bg.png
├── audio/
│   ├── music/
│   │   ├── gameplay.ogg
│   │   └── boss.ogg
│   └── sfx/
│       ├── jump.ogg
│       ├── collect.ogg
│       └── shoot.ogg
└── level-data/
    └── level1.json (Tiled export or custom format)
```

**Best Practices**:
- Use Phaser's `this.load.spritesheet()` for character animations
- Load all assets in dedicated Preload Scene before gameplay
- Use `this.load.atlas()` for texture packer output (better than individual sheets)
- Implement loading bar with `this.load.on('progress')` callback
- Compress audio: OGG for modern browsers, MP3 fallback
- Keep total bundle under 2MB target (lazy-load boss assets if needed)

### Performance Optimization Techniques
**60 FPS Guarantee**:
1. **Object Pooling**: Reuse projectile/coin game objects instead of create/destroy
2. **Limit Physics Bodies**: Use static bodies for platforms, kinematic for moving platforms
3. **Reduce Draw Calls**: Batch sprites into texture atlases, use sprite sheets
4. **Optimize Update Loop**: Only update visible/active entities
5. **Use Arcade Physics**: Lightweight compared to Matter.js for simple 2D
6. **Disable Unused Features**: Turn off debug rendering in production builds

**Monitoring**:
```typescript
// Add FPS counter in development
this.add.text(10, 10, '', { font: '16px Arial' })
    .setScrollFactor(0)
    .setDepth(1000);

this.time.addEvent({
    delay: 100,
    callback: () => {
        fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
    },
    loop: true
});
```

### Input Handling Best Practices
**Pattern**: Centralized input manager in Game Scene

**Implementation**:
```typescript
class InputManager {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private shootKey: Phaser.Input.Keyboard.Key;
    
    constructor(scene: Phaser.Scene) {
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.shootKey = scene.input.keyboard.addKey('SHIFT');
    }
    
    getMovement(): { x: number, jump: boolean, shoot: boolean } {
        return {
            x: (this.cursors.left.isDown ? -1 : 0) + (this.cursors.right.isDown ? 1 : 0),
            jump: Phaser.Input.Keyboard.JustDown(this.cursors.space),
            shoot: Phaser.Input.Keyboard.JustDown(this.shootKey)
        };
    }
}
```

**Best Practices**:
- Use `JustDown()` for single-press actions (jump, shoot)
- Implement input buffering for responsive jump input (store input for 3-5 frames)
- Add coyote time (allow jump for 100ms after leaving platform edge)
- Prevent diagonal slowdown: normalize movement vector if both axes active

### Collision Detection Strategy
**Pattern**: Physics groups with overlap callbacks

**Implementation**:
```typescript
// Setup
this.physics.add.overlap(
    this.player,
    this.enemiesGroup,
    this.handlePlayerEnemyCollision,
    undefined,
    this
);

// Handler with stomp detection
handlePlayerEnemyCollision(player, enemy) {
    if (player.body.velocity.y > 0 && player.y < enemy.y) {
        // Stomp kill
        enemy.destroy();
        player.setVelocityY(-300); // Bounce
    } else {
        // Player dies
        this.playerDeath();
    }
}
```

**Best Practices**:
- Use `overlap()` for non-blocking collisions (coins, power-ups)
- Use `collider()` for solid collisions (platforms, walls)
- Implement precise hitboxes: `setSize()` to adjust collision boxes smaller than sprite
- Add collision layers for optimization (player layer, enemy layer, projectile layer)

### State Management Pattern
**Pattern**: Component-based entity state

**Implementation**:
```typescript
class Player extends Phaser.Physics.Arcade.Sprite {
    private lives: number = 3;
    private hasWizardHat: boolean = false;
    private invincible: boolean = false;
    private facingDirection: number = 1; // 1 = right, -1 = left
    
    takeDamage() {
        if (this.invincible) return;
        
        this.lives--;
        this.scene.events.emit('lives-changed', this.lives);
        
        if (this.lives <= 0) {
            this.scene.scene.start('GameOverScene', { time: this.scene.gameTimer });
        } else {
            this.respawnAtCheckpoint();
        }
    }
    
    respawnAtCheckpoint() {
        this.hasWizardHat = false;
        this.invincible = true;
        this.setPosition(checkpointX, checkpointY);
        
        this.scene.time.delayedCall(1000, () => {
            this.invincible = false;
        });
    }
}
```

**Best Practices**:
- Emit events for UI updates (lives, coins) instead of direct HUD manipulation
- Store checkpoint data in Scene registry for persistence across respawns
- Use component pattern: separate scripts for PlayerMovement, PlayerCombat, PlayerInventory
- Leverage Phaser's Data Manager for reactive state: `this.setData('lives', 3)`

### Animation Configuration
**Pattern**: Animation registry in Boot/Preload scene

**Implementation**:
```typescript
// Preload Scene
this.anims.create({
    key: 'hugo-run',
    frames: this.anims.generateFrameNumbers('hugo', { start: 0, end: 7 }),
    frameRate: 12,
    repeat: -1
});

this.anims.create({
    key: 'hugo-jump',
    frames: this.anims.generateFrameNumbers('hugo', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: 0
});

// Game Scene update loop
if (this.player.body.velocity.y !== 0) {
    this.player.anims.play('hugo-jump', true);
} else if (Math.abs(this.player.body.velocity.x) > 0) {
    this.player.anims.play('hugo-run', true);
} else {
    this.player.anims.play('hugo-idle', true);
}
```

**Best Practices**:
- Define all animations centrally in Preload scene
- Use animation priority system: jump > run > idle
- Add animation callbacks for events (e.g., footstep SFX on specific frames)
- Mirror sprites with `setFlipX()` instead of duplicate left/right animations

### Level Data Format
**Decision**: JSON-based custom format over Tiled

**Rationale**:
- Simple data structure for single-screen scrolling level
- Easy to hand-craft for initial version
- Can migrate to Tiled later if level complexity grows
- Smaller file size than TMX export

**Structure**:
```json
{
    "platforms": [
        { "x": 0, "y": 550, "width": 800, "type": "ground" },
        { "x": 200, "y": 400, "width": 150, "type": "moving", "path": [[200,400], [400,400]], "speed": 50 }
    ],
    "enemies": [
        { "type": "shark", "x": 300, "y": 500, "patrol": [200, 500] },
        { "type": "bird", "x": 600, "y": 200, "direction": "left" }
    ],
    "collectibles": [
        { "type": "coin", "x": 250, "y": 380 },
        { "type": "wizard-hat", "x": 800, "y": 300 }
    ],
    "checkpoints": [
        { "x": 400, "y": 550 },
        { "x": 1200, "y": 550 }
    ],
    "bossArena": { "x": 2000, "y": 300, "width": 800, "height": 600 }
}
```

### Audio Implementation
**Pattern**: Scene-based audio manager with crossfade

**Implementation**:
```typescript
class AudioManager {
    private music: Phaser.Sound.BaseSound;
    private sfx: Map<string, Phaser.Sound.BaseSound> = new Map();
    
    playMusic(key: string, fade: boolean = true) {
        if (this.music && fade) {
            this.scene.tweens.add({
                targets: this.music,
                volume: 0,
                duration: 500,
                onComplete: () => {
                    this.music.stop();
                    this.music = this.scene.sound.add(key, { loop: true, volume: 0.6 });
                    this.music.play();
                }
            });
        } else {
            this.music = this.scene.sound.add(key, { loop: true, volume: 0.6 });
            this.music.play();
        }
    }
    
    playSFX(key: string) {
        if (!this.sfx.has(key)) {
            this.sfx.set(key, this.scene.sound.add(key));
        }
        this.sfx.get(key).play();
    }
}
```

**Best Practices**:
- Use Web Audio API (Phaser's default) for better performance
- Preload all audio in Preload scene
- Implement audio sprite for multiple SFX in one file
- Add mute toggle in pause menu (store in localStorage)
- Keep music loops seamless (verify loop points in audio editor)

## Integration Patterns

### Vite + Phaser Configuration
**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true
            }
        }
    },
    server: {
        port: 3000,
        open: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'public/assets')
        }
    }
});
```

### TypeScript Configuration
**tsconfig.json**:
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020", "DOM"],
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@assets/*": ["public/assets/*"]
        }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### ESLint + Prettier Setup
**.eslintrc.json**:
```json
{
    "parser": "@typescript-eslint/parser",
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
}
```

## Deployment Strategy

### GitHub Pages Deployment
**Build Process**:
1. `npm run build` → generates `/dist` with static assets
2. GitHub Actions workflow deploys to `gh-pages` branch
3. Custom domain support via CNAME file

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Bundle Size Optimization
**Strategies**:
- Code splitting: Phaser in separate chunk (faster caching)
- Tree shaking: Import only used Phaser modules
- Asset compression: Use TinyPNG for sprites, FFmpeg for audio
- Lazy load boss assets when entering arena (stay under 2MB initial)
- Enable Brotli compression on hosting (GitHub Pages supports this)

## Risk Mitigation

### Performance Risks
**Risk**: Complex boss patterns + projectiles cause FPS drops
**Mitigation**: Object pooling for projectiles, limit max on-screen to 20

**Risk**: Large sprite sheets exceed texture memory on older GPUs
**Mitigation**: Keep individual sheets under 2048×2048, use multiple atlases

### Cross-Browser Compatibility
**Risk**: Audio playback issues in Safari (autoplay policy)
**Mitigation**: Require user interaction before starting music, show "Click to Start" splash

**Risk**: Keyboard input conflicts with browser shortcuts
**Mitigation**: `event.preventDefault()` on game keys, document required browser setup

### Development Workflow Risks
**Risk**: Hand-drawn art assets delayed
**Mitigation**: Use placeholder rectangles with color coding, define sprite sheet format early

**Risk**: Physics tuning requires many iterations
**Mitigation**: Expose gravity/jump force as scene data constants, hot-reload with Vite HMR

## Next Steps (Phase 1)

1. Define data model for all game entities
2. Create TypeScript interfaces for level data, save data, game config
3. Document module contracts (Scene interfaces, Entity base classes)
4. Generate quickstart guide for local development setup
5. Update agent context with Phaser 3 + Vite stack

---

**Research Complete**: 2025-10-31  
**Ready for Phase 1**: Design & Contracts
