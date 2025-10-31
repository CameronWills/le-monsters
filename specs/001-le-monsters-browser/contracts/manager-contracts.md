# Manager Service Contracts

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Purpose**: Define interfaces for game management services (input, audio, state, etc.)

## Input Manager Contract

**Responsibility**: Centralized keyboard input handling with buffering and coyote time

```typescript
interface IInputManager {
    /**
     * Initialize input manager
     * Register keyboard listeners
     * @param scene - Scene to register inputs in
     */
    init(scene: Phaser.Scene): void;
    
    /**
     * Update input state
     * Process buffering and coyote time
     * @param delta - Time since last frame (ms)
     */
    update(delta: number): void;
    
    /**
     * Get current movement input
     * @returns -1 (left), 0 (none), 1 (right)
     */
    getMovementX(): -1 | 0 | 1;
    
    /**
     * Check if jump was pressed
     * Includes input buffering (3-5 frame window)
     * @returns True if jump input detected
     */
    isJumpPressed(): boolean;
    
    /**
     * Check if shoot was pressed
     * Only works with wizard hat power-up
     * @returns True if shoot input detected
     */
    isShootPressed(): boolean;
    
    /**
     * Check if pause was pressed
     * @returns True if ESC key just pressed
     */
    isPausePressed(): boolean;
    
    /**
     * Enable/disable input processing
     * Used during cutscenes or menus
     */
    setEnabled(enabled: boolean): void;
    
    /**
     * Clear input buffer
     * Called when player dies or respawns
     */
    clearBuffer(): void;
}
```

**Input Buffering**:
- Store jump input for 5 frames (~83ms at 60fps)
- Allows player to press jump slightly before landing
- Improves responsiveness and feel

**Coyote Time**:
- Allow jump for 100ms after leaving platform edge
- Makes platforming more forgiving
- Implemented in Player class, not InputManager

---

## Audio Manager Contract

**Responsibility**: Centralized audio playback with crossfade and volume control

```typescript
interface IAudioManager {
    /**
     * Initialize audio manager
     * @param scene - Scene to create audio in
     */
    init(scene: Phaser.Scene): void;
    
    // === Music ===
    
    /**
     * Play background music
     * Crossfades from current music if playing
     * @param key - Audio asset key
     * @param fadeIn - Whether to fade in (default: true)
     */
    playMusic(key: string, fadeIn?: boolean): void;
    
    /**
     * Stop current music
     * @param fadeOut - Whether to fade out (default: true)
     */
    stopMusic(fadeOut?: boolean): void;
    
    /**
     * Pause current music
     * Used during pause menu
     */
    pauseMusic(): void;
    
    /**
     * Resume paused music
     */
    resumeMusic(): void;
    
    /**
     * Set music volume
     * @param volume - Volume level (0.0 to 1.0)
     */
    setMusicVolume(volume: number): void;
    
    /**
     * Mute/unmute music
     */
    toggleMusicMute(): void;
    
    // === Sound Effects ===
    
    /**
     * Play sound effect
     * @param key - Audio asset key
     * @param volume - Optional volume override (0.0 to 1.0)
     */
    playSFX(key: string, volume?: number): void;
    
    /**
     * Set global SFX volume
     * @param volume - Volume level (0.0 to 1.0)
     */
    setSFXVolume(volume: number): void;
    
    /**
     * Mute/unmute sound effects
     */
    toggleSFXMute(): void;
    
    // === Preloading ===
    
    /**
     * Preload all audio assets
     * Called from Preload scene
     * @param scene - Scene to load assets in
     */
    preloadAudio(scene: Phaser.Scene): void;
    
    // === Save/Load ===
    
    /**
     * Load audio settings from save data
     * @param settings - Saved audio settings
     */
    loadSettings(settings: IAudioSettings): void;
    
    /**
     * Get current audio settings for saving
     * @returns Current settings
     */
    getSettings(): IAudioSettings;
}

interface IAudioSettings {
    musicVolume: number; // 0.0 to 1.0
    sfxVolume: number; // 0.0 to 1.0
    musicMuted: boolean;
    sfxMuted: boolean;
}
```

**Audio Assets**:
```typescript
const AUDIO_ASSETS = {
    music: {
        gameplay: 'assets/audio/music/gameplay.ogg',
        boss: 'assets/audio/music/boss.ogg',
        victory: 'assets/audio/music/victory.ogg'
    },
    sfx: {
        jump: 'assets/audio/sfx/jump.ogg',
        land: 'assets/audio/sfx/land.ogg',
        collect_coin: 'assets/audio/sfx/collect-coin.ogg',
        collect_powerup: 'assets/audio/sfx/collect-powerup.ogg',
        shoot: 'assets/audio/sfx/shoot.ogg',
        enemy_defeat: 'assets/audio/sfx/enemy-defeat.ogg',
        player_death: 'assets/audio/sfx/player-death.ogg',
        checkpoint: 'assets/audio/sfx/checkpoint.ogg',
        boss_hit: 'assets/audio/sfx/boss-hit.ogg',
        boss_defeat: 'assets/audio/sfx/boss-defeat.ogg'
    }
};
```

---

## Game State Manager Contract

**Responsibility**: Global game state and session management

```typescript
interface IGameStateManager {
    /**
     * Initialize new game session
     * @returns New session data
     */
    startNewSession(): IGameSession;
    
    /**
     * Get current game session
     * @returns Current session or null if none active
     */
    getCurrentSession(): IGameSession | null;
    
    /**
     * Update game timer
     * @param delta - Time since last frame (ms)
     */
    updateTimer(delta: number): void;
    
    /**
     * Get elapsed time in milliseconds
     */
    getElapsedTime(): number;
    
    /**
     * Get elapsed time formatted as MM:SS
     */
    getFormattedTime(): string;
    
    /**
     * Increase coin count
     */
    collectCoin(): void;
    
    /**
     * Get total coins collected
     */
    getCoinCount(): number;
    
    /**
     * Decrease player lives
     * @returns Lives remaining
     */
    loseLife(): number;
    
    /**
     * Get current lives
     */
    getLives(): number;
    
    /**
     * Set current checkpoint
     * @param checkpoint - Checkpoint to save
     */
    setCheckpoint(checkpoint: ICheckpoint): void;
    
    /**
     * Get current checkpoint for respawn
     */
    getCurrentCheckpoint(): ICheckpoint | null;
    
    /**
     * Mark boss as defeated
     */
    defeatBoss(): void;
    
    /**
     * Check if boss is defeated
     */
    isBossDefeated(): boolean;
    
    /**
     * End current session
     * @returns Final session data for victory/game over screen
     */
    endSession(): ISessionEndData;
}

interface IGameSession {
    lives: number;
    coinsCollected: number;
    currentCheckpoint: ICheckpoint | null;
    gameStartTime: number;
    elapsedTime: number;
    bossDefeated: boolean;
}

interface ISessionEndData {
    finalTime: number; // milliseconds
    coinsCollected: number;
}
```

---

## Save Data Manager Contract

**Responsibility**: Persistent storage using LocalStorage

```typescript
interface ISaveDataManager {
    /**
     * Load save data from LocalStorage
     * Creates default data if none exists
     * @returns Loaded or default save data
     */
    load(): ISaveData;
    
    /**
     * Save data to LocalStorage
     * @param data - Data to save
     */
    save(data: ISaveData): void;
    
    /**
     * Update best time if new time is better
     * @param time - Completion time in milliseconds
     * @returns True if new best time set
     */
    updateBestTime(time: number): boolean;
    
    /**
     * Get current best time
     * @returns Best time in milliseconds or null if never completed
     */
    getBestTime(): number | null;
    
    /**
     * Get best time formatted as MM:SS
     * @returns Formatted time or "N/A" if never completed
     */
    getFormattedBestTime(): string;
    
    /**
     * Increase total coins collected across all playthroughs
     * @param amount - Number of coins to add
     */
    addTotalCoins(amount: number): void;
    
    /**
     * Get total coins collected (lifetime)
     */
    getTotalCoins(): number;
    
    /**
     * Update audio settings
     * @param settings - New audio settings
     */
    updateAudioSettings(settings: IAudioSettings): void;
    
    /**
     * Get audio settings
     */
    getAudioSettings(): IAudioSettings;
    
    /**
     * Clear all save data (reset)
     */
    clearAll(): void;
}

interface ISaveData {
    bestTime: number | null;
    totalCoinsCollected: number;
    audioSettings: IAudioSettings;
}
```

**LocalStorage Key**: `'le-monsters-save'`

**Default Save Data**:
```typescript
const DEFAULT_SAVE_DATA: ISaveData = {
    bestTime: null,
    totalCoinsCollected: 0,
    audioSettings: {
        musicVolume: 0.6,
        sfxVolume: 0.8,
        musicMuted: false,
        sfxMuted: false
    }
};
```

---

## Level Data Manager Contract

**Responsibility**: Load and parse level data from JSON

```typescript
interface ILevelDataManager {
    /**
     * Load level data from JSON file
     * @param scene - Scene to load in
     * @param levelKey - Level JSON asset key
     */
    loadLevel(scene: Phaser.Scene, levelKey: string): void;
    
    /**
     * Parse loaded level data
     * @param levelKey - Level JSON asset key
     * @returns Parsed level data
     */
    parseLevel(levelKey: string): ILevelData;
    
    /**
     * Get level metadata
     * @param levelKey - Level JSON asset key
     * @returns Level metadata
     */
    getLevelMetadata(levelKey: string): ILevelMetadata;
}

interface ILevelData {
    metadata: ILevelMetadata;
    playerStart: { x: number; y: number };
    platforms: IPlatformData[];
    checkpoints: ICheckpointData[];
    enemies: IEnemyData[];
    coins: ICoinData[];
    powerUps: IPowerUpData[];
    bossArena: IBossArenaData;
}

interface ILevelMetadata {
    id: string;
    name: string;
    width: number;
    height: number;
    background: string;
}
```

**Level JSON Structure** (`assets/level-data/level1.json`):
```json
{
    "metadata": {
        "id": "level1",
        "name": "The Forest",
        "width": 3200,
        "height": 1080,
        "background": "forest-bg"
    },
    "playerStart": { "x": 100, "y": 900 },
    "platforms": [
        {
            "x": 0,
            "y": 1000,
            "width": 3200,
            "height": 80,
            "type": "static"
        },
        {
            "x": 300,
            "y": 800,
            "width": 200,
            "height": 20,
            "type": "moving",
            "path": [
                { "x": 300, "y": 800 },
                { "x": 500, "y": 800 }
            ],
            "speed": 50
        }
    ],
    "checkpoints": [
        { "x": 800, "y": 900 },
        { "x": 1600, "y": 900 },
        { "x": 2400, "y": 900 },
        { "x": 2900, "y": 900 }
    ],
    "enemies": [
        {
            "type": "shark",
            "x": 500,
            "y": 950,
            "patrolStart": 400,
            "patrolEnd": 700
        },
        {
            "type": "bird",
            "x": 1000,
            "y": 300,
            "flyDirection": -1
        }
    ],
    "coins": [
        { "x": 400, "y": 850 },
        { "x": 450, "y": 850 },
        { "x": 500, "y": 850 }
    ],
    "powerUps": [
        {
            "type": "wizard-hat",
            "x": 1200,
            "y": 700
        }
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

## HUD Manager Contract

**Responsibility**: Display and update heads-up display

```typescript
interface IHUDManager {
    /**
     * Initialize HUD
     * Create UI elements
     * @param scene - Scene to create HUD in
     */
    init(scene: Phaser.Scene): void;
    
    /**
     * Update lives display
     * @param lives - Current lives (0-3)
     */
    updateLives(lives: number): void;
    
    /**
     * Update coins display
     * @param coins - Total coins collected
     */
    updateCoins(coins: number): void;
    
    /**
     * Update timer display
     * @param time - Elapsed time in milliseconds
     */
    updateTimer(time: number): void;
    
    /**
     * Show boss health bar
     * Only visible during boss battle
     */
    showBossHealthBar(): void;
    
    /**
     * Hide boss health bar
     */
    hideBossHealthBar(): void;
    
    /**
     * Update boss health bar
     * @param health - Current boss health
     * @param maxHealth - Maximum boss health
     */
    updateBossHealth(health: number, maxHealth: number): void;
    
    /**
     * Show/hide entire HUD
     * Hidden during cutscenes
     */
    setVisible(visible: boolean): void;
    
    /**
     * Destroy HUD
     * Called when scene ends
     */
    destroy(): void;
}
```

**HUD Layout**:
```
┌────────────────────────────────────────┐
│ ❤❤❤  Coins: 12  Time: 03:45           │  ← Top-left corner
│                                        │
│                                        │
│          [Boss Health Bar]             │  ← Top-center (only during boss fight)
│                                        │
│                                        │
└────────────────────────────────────────┘
```

---

## Collision Manager Contract

**Responsibility**: Setup and manage collision detection

```typescript
interface ICollisionManager {
    /**
     * Initialize collision system
     * @param scene - Scene to setup collisions in
     */
    init(scene: Phaser.Scene): void;
    
    /**
     * Setup player collisions
     * @param player - Player entity
     * @param platforms - Platform group
     * @param enemies - Enemy group
     * @param collectibles - Collectibles group
     * @param checkpoints - Checkpoint group
     */
    setupPlayerCollisions(
        player: IPlayer,
        platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group,
        enemies: Phaser.Physics.Arcade.Group,
        collectibles: Phaser.Physics.Arcade.Group,
        checkpoints: Phaser.Physics.Arcade.Group
    ): void;
    
    /**
     * Setup projectile collisions
     * @param playerProjectiles - Player projectile group
     * @param enemyProjectiles - Enemy projectile group
     * @param bossProjectiles - Boss projectile group
     * @param enemies - Enemy group
     * @param boss - Boss entity
     * @param platforms - Platform group
     */
    setupProjectileCollisions(
        playerProjectiles: Phaser.Physics.Arcade.Group,
        enemyProjectiles: Phaser.Physics.Arcade.Group,
        bossProjectiles: Phaser.Physics.Arcade.Group,
        enemies: Phaser.Physics.Arcade.Group,
        boss: IBoss | null,
        platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group
    ): void;
    
    /**
     * Setup enemy collisions
     * @param enemies - Enemy group
     * @param platforms - Platform group
     */
    setupEnemyCollisions(
        enemies: Phaser.Physics.Arcade.Group,
        platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group
    ): void;
    
    /**
     * Disable all collisions
     * Used during pause or scene transition
     */
    disableAll(): void;
    
    /**
     * Enable all collisions
     * Used when resuming from pause
     */
    enableAll(): void;
}
```

---

## Animation Manager Contract

**Responsibility**: Register and manage sprite animations

```typescript
interface IAnimationManager {
    /**
     * Register all game animations
     * Called in Preload scene after assets loaded
     * @param scene - Scene to register animations in
     */
    registerAllAnimations(scene: Phaser.Scene): void;
    
    /**
     * Register player animations
     */
    registerPlayerAnimations(scene: Phaser.Scene): void;
    
    /**
     * Register enemy animations
     */
    registerEnemyAnimations(scene: Phaser.Scene): void;
    
    /**
     * Register boss animations
     */
    registerBossAnimations(scene: Phaser.Scene): void;
    
    /**
     * Register collectible animations
     */
    registerCollectibleAnimations(scene: Phaser.Scene): void;
    
    /**
     * Register UI animations
     */
    registerUIAnimations(scene: Phaser.Scene): void;
}
```

**Animation Keys**:
```typescript
const ANIMATION_KEYS = {
    player: {
        idle: 'hugo-idle',
        run: 'hugo-run',
        jump: 'hugo-jump',
        fall: 'hugo-fall',
        death: 'hugo-death'
    },
    enemies: {
        birdFly: 'bird-fly',
        sharkSwim: 'shark-swim'
    },
    boss: {
        idle: 'boss-idle',
        attack: 'boss-attack',
        hurt: 'boss-hurt',
        death: 'boss-death'
    },
    collectibles: {
        coinSpin: 'coin-spin',
        wizardHatFloat: 'wizard-hat-float'
    },
    ui: {
        flagRaise: 'flag-raise'
    }
};
```

---

## Camera Manager Contract

**Responsibility**: Control camera movement and effects

```typescript
interface ICameraManager {
    /**
     * Initialize camera
     * @param scene - Scene to setup camera in
     */
    init(scene: Phaser.Scene): void;
    
    /**
     * Follow player with camera
     * @param player - Player entity to follow
     */
    followPlayer(player: IPlayer): void;
    
    /**
     * Set camera bounds
     * @param width - Level width
     * @param height - Level height
     */
    setBounds(width: number, height: number): void;
    
    /**
     * Shake camera (for impacts)
     * @param intensity - Shake intensity (0.0 to 1.0)
     * @param duration - Shake duration in milliseconds
     */
    shake(intensity: number, duration: number): void;
    
    /**
     * Flash camera (for damage effects)
     * @param color - Flash color (RGB hex)
     * @param duration - Flash duration in milliseconds
     */
    flash(color: number, duration: number): void;
    
    /**
     * Fade camera to black
     * @param duration - Fade duration in milliseconds
     * @param onComplete - Callback when fade complete
     */
    fadeOut(duration: number, onComplete: () => void): void;
    
    /**
     * Fade camera from black
     * @param duration - Fade duration in milliseconds
     */
    fadeIn(duration: number): void;
    
    /**
     * Pan camera to position
     * @param x - Target x position
     * @param y - Target y position
     * @param duration - Pan duration in milliseconds
     */
    panTo(x: number, y: number, duration: number): void;
    
    /**
     * Stop following player
     */
    stopFollow(): void;
}
```

---

**Manager Service Contracts Complete**: 2025-10-31  
**All contracts defined for Phase 1**
