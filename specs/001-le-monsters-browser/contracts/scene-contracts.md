# Scene Contracts

**Feature**: 001-le-monsters-browser  
**Date**: 2025-10-31  
**Purpose**: Define interfaces for Phaser 3 Scene lifecycle and communication

## Base Scene Interface

All game scenes must implement this contract for consistent lifecycle management.

```typescript
/**
 * Base contract for all game scenes
 * Extends Phaser.Scene with standardized lifecycle hooks
 */
interface IGameScene {
    /**
     * Unique identifier for this scene
     * Used for scene transitions and debugging
     */
    readonly sceneKey: string;
    
    /**
     * Initialize scene with data from previous scene
     * Called before preload()
     * @param data - Optional data passed from scene.start()
     */
    init(data?: Record<string, unknown>): void;
    
    /**
     * Load assets required for this scene
     * Only called if assets not already in cache
     */
    preload(): void;
    
    /**
     * Create scene game objects and setup initial state
     * Called after preload completes
     */
    create(): void;
    
    /**
     * Update loop called every frame (60fps target)
     * @param time - Total elapsed time since game start (ms)
     * @param delta - Time elapsed since last frame (ms)
     */
    update(time: number, delta: number): void;
    
    /**
     * Cleanup when scene is stopped or paused
     * Remove event listeners, stop timers, etc.
     */
    shutdown(): void;
}
```

---

## Boot Scene Contract

**Responsibility**: Initialize game, load critical assets, set up global configuration

```typescript
interface IBootScene extends IGameScene {
    sceneKey: 'BootScene';
    
    /**
     * Configure Phaser game settings
     * - Set canvas size
     * - Configure physics world
     * - Register global animations
     */
    configureGame(): void;
    
    /**
     * Load minimal assets needed for preloader
     * - Logo
     * - Loading bar graphics
     */
    loadBootAssets(): void;
    
    /**
     * Transition to Preload scene
     */
    startPreloader(): void;
}
```

**Inputs**: None  
**Outputs**: Transition to PreloadScene

---

## Preload Scene Contract

**Responsibility**: Load all game assets with progress tracking

```typescript
interface IPreloadScene extends IGameScene {
    sceneKey: 'PreloadScene';
    
    /**
     * Display loading screen with progress bar
     */
    createLoadingUI(): void;
    
    /**
     * Load all game assets
     * - Sprite sheets (Hugo, enemies, boss)
     * - Audio files (music, SFX)
     * - Level data JSON
     * - UI graphics
     */
    loadGameAssets(): void;
    
    /**
     * Register sprite animations for all entities
     * Called after assets loaded, before scene transition
     */
    createAnimations(): void;
    
    /**
     * Update progress bar during asset loading
     * @param progress - Load progress (0.0 to 1.0)
     */
    updateProgressBar(progress: number): void;
    
    /**
     * Transition to Main Menu when loading complete
     */
    startMainMenu(): void;
}
```

**Inputs**: None  
**Outputs**: 
- All game assets cached
- Animations registered
- Transition to MainMenuScene

---

## Main Menu Scene Contract

**Responsibility**: Display menu options, handle navigation, show best time

```typescript
interface IMainMenuScene extends IGameScene {
    sceneKey: 'MainMenuScene';
    
    /**
     * Create menu UI elements
     * - Background
     * - "New Game" button
     * - "About" button
     * - Best time display (if exists)
     */
    createMenuUI(): void;
    
    /**
     * Load save data from LocalStorage
     * Display best time if player has completed game before
     */
    loadSaveData(): ISaveData;
    
    /**
     * Handle "New Game" button click
     * Start GameScene with fresh session data
     */
    startNewGame(): void;
    
    /**
     * Handle "About" button click
     * Navigate to AboutScene
     */
    showAbout(): void;
    
    /**
     * Handle button hover effects and audio feedback
     */
    setupButtonInteractions(): void;
}
```

**Inputs**: Save data from LocalStorage  
**Outputs**: 
- Transition to GameScene (with new session data)
- OR transition to AboutScene

---

## About Scene Contract

**Responsibility**: Display project information and credits

```typescript
interface IAboutScene extends IGameScene {
    sceneKey: 'AboutScene';
    
    /**
     * Create about screen content
     * - Project description
     * - Author information
     * - "Back" button
     */
    createAboutUI(): void;
    
    /**
     * Return to Main Menu
     */
    returnToMenu(): void;
}
```

**Inputs**: None  
**Outputs**: Transition to MainMenuScene

---

## Game Scene Contract

**Responsibility**: Core gameplay loop, entity management, collision detection

```typescript
interface IGameScene extends IGameScene {
    sceneKey: 'GameScene';
    
    // === Initialization ===
    
    /**
     * Load level data from JSON
     * Parse and create all entities
     */
    loadLevel(levelKey: string): void;
    
    /**
     * Create player at starting position
     */
    createPlayer(startPosition: { x: number; y: number }): void;
    
    /**
     * Create all platforms from level data
     * Setup static and moving platform physics
     */
    createPlatforms(platformData: IPlatformData[]): void;
    
    /**
     * Spawn all enemies at their initial positions
     */
    createEnemies(enemyData: IEnemyData[]): void;
    
    /**
     * Create collectibles (coins, wizard hat)
     */
    createCollectibles(coinData: ICoinData[], powerUpData: IPowerUpData[]): void;
    
    /**
     * Create checkpoints at designated positions
     */
    createCheckpoints(checkpointData: ICheckpointData[]): void;
    
    /**
     * Setup collision handlers between all entity types
     */
    setupCollisionHandlers(): void;
    
    /**
     * Create HUD overlay (lives, coins, timer)
     */
    createHUD(): void;
    
    /**
     * Initialize game session state
     */
    startGameSession(): void;
    
    // === Update Loop ===
    
    /**
     * Process player input and update player state
     */
    updatePlayer(delta: number): void;
    
    /**
     * Update all enemies (movement, attack patterns)
     */
    updateEnemies(delta: number): void;
    
    /**
     * Update boss (if in arena)
     */
    updateBoss(delta: number): void;
    
    /**
     * Update all projectiles (movement, collision, cleanup)
     */
    updateProjectiles(delta: number): void;
    
    /**
     * Update moving platforms
     */
    updateMovingPlatforms(delta: number): void;
    
    /**
     * Update game timer and HUD
     */
    updateGameState(delta: number): void;
    
    /**
     * Check if player entered boss arena
     * Trigger boss battle if true
     */
    checkBossArenaEntry(): void;
    
    // === Collision Handlers ===
    
    /**
     * Handle player collision with enemy
     * Check for stomp vs. death
     */
    handlePlayerEnemyCollision(player: IPlayer, enemy: IEnemyBird | IEnemyShark): void;
    
    /**
     * Handle player collecting coin
     */
    handlePlayerCoinCollision(player: IPlayer, coin: ICoin): void;
    
    /**
     * Handle player collecting wizard hat
     */
    handlePlayerPowerUpCollision(player: IPlayer, powerUp: IPowerUpWizardHat): void;
    
    /**
     * Handle player passing checkpoint
     */
    handlePlayerCheckpointCollision(player: IPlayer, checkpoint: ICheckpoint): void;
    
    /**
     * Handle player projectile hitting enemy
     */
    handleProjectileEnemyCollision(projectile: IPlayerProjectile, enemy: IEnemyBird | IEnemyShark): void;
    
    /**
     * Handle player projectile hitting boss
     */
    handleProjectileBossCollision(projectile: IPlayerProjectile, boss: IBoss): void;
    
    /**
     * Handle enemy projectile hitting player
     */
    handleEnemyProjectilePlayerCollision(projectile: IEnemyProjectile | IBossProjectile, player: IPlayer): void;
    
    /**
     * Handle player falling into pit (out of bounds)
     */
    handlePlayerOutOfBounds(player: IPlayer): void;
    
    // === Game State Management ===
    
    /**
     * Trigger player death sequence
     * - Play death animation
     * - Decrease lives
     * - Respawn or game over
     */
    triggerPlayerDeath(): void;
    
    /**
     * Respawn player at last checkpoint
     * - Reset power-ups
     * - Grant invincibility
     * - Respawn enemies
     */
    respawnPlayer(): void;
    
    /**
     * Activate boss battle
     * - Change lighting
     * - Start boss music
     * - Show boss health bar
     */
    startBossBattle(): void;
    
    /**
     * Handle boss defeat
     * - Stop boss music
     * - Play victory music
     * - Transition to VictoryScene
     */
    defeatBoss(): void;
    
    /**
     * Handle game over (lives = 0)
     * - Stop gameplay
     * - Transition to GameOverScene
     */
    triggerGameOver(): void;
    
    /**
     * Handle pause request (ESC key)
     * - Pause physics
     * - Launch PauseScene as overlay
     */
    pauseGame(): void;
    
    /**
     * Resume from pause
     * - Resume physics
     * - Continue music
     */
    resumeGame(): void;
}
```

**Inputs**: 
- Level data JSON
- Session data (new game or resume)

**Outputs**: 
- Transition to VictoryScene (on boss defeat) with final time
- Transition to GameOverScene (on lives = 0) with final time
- Launch PauseScene (on ESC key)

---

## Pause Scene Contract

**Responsibility**: Overlay pause menu with resume/quit options

```typescript
interface IPauseScene extends IGameScene {
    sceneKey: 'PauseScene';
    
    /**
     * Create pause menu UI
     * - Semi-transparent background
     * - "Continue" button
     * - "Main Menu" button
     * - Volume controls (optional)
     */
    createPauseUI(): void;
    
    /**
     * Resume game and close pause scene
     * Notify GameScene to resume physics
     */
    continueGame(): void;
    
    /**
     * Show confirmation dialog before quitting
     * "Are you sure? Progress will be lost."
     */
    confirmQuitToMenu(): void;
    
    /**
     * Quit to main menu (after confirmation)
     * Stop GameScene, transition to MainMenuScene
     */
    quitToMenu(): void;
}
```

**Inputs**: Reference to paused GameScene  
**Outputs**: 
- Resume GameScene
- OR stop GameScene and transition to MainMenuScene

---

## Victory Scene Contract

**Responsibility**: Display victory screen, save best time, show stats

```typescript
interface IVictoryScene extends IGameScene {
    sceneKey: 'VictoryScene';
    
    /**
     * Initialize with game completion data
     * @param data - Contains finalTime, coinsCollected
     */
    init(data: { finalTime: number; coinsCollected: number }): void;
    
    /**
     * Create victory screen
     * - Celebration graphics
     * - Final time display
     * - Coins collected display
     * - Best time comparison
     * - "Main Menu" button
     */
    createVictoryUI(finalTime: number, coinsCollected: number): void;
    
    /**
     * Check if new best time achieved
     * Update save data if improved
     */
    checkAndSaveBestTime(finalTime: number): boolean;
    
    /**
     * Return to main menu
     */
    returnToMenu(): void;
}
```

**Inputs**: 
- Final time (milliseconds)
- Coins collected

**Outputs**: 
- Updated save data (if new best time)
- Transition to MainMenuScene

---

## Game Over Scene Contract

**Responsibility**: Display game over screen, show final stats

```typescript
interface IGameOverScene extends IGameScene {
    sceneKey: 'GameOverScene';
    
    /**
     * Initialize with game data
     * @param data - Contains finalTime, coinsCollected
     */
    init(data: { finalTime: number; coinsCollected: number }): void;
    
    /**
     * Create game over screen
     * - "Game Over" text
     * - Final time display
     * - Coins collected display
     * - "Try Again" button
     * - "Main Menu" button
     */
    createGameOverUI(finalTime: number, coinsCollected: number): void;
    
    /**
     * Restart game (new session)
     * Transition to GameScene with fresh state
     */
    tryAgain(): void;
    
    /**
     * Return to main menu
     */
    returnToMenu(): void;
}
```

**Inputs**: 
- Final time (milliseconds)
- Coins collected

**Outputs**: 
- Transition to GameScene (try again)
- OR transition to MainMenuScene

---

## Scene Transition Flow

```
Boot → Preload → MainMenu ⇄ About
                     ↓
                  Game ⇄ Pause
                     ↓
         ┌───────────┴───────────┐
         ↓                       ↓
      Victory                GameOver
         ↓                       ↓
         └───────→ MainMenu ←────┘
```

---

## Scene Data Contracts

### New Game Session Data
```typescript
interface INewGameSessionData {
    levelKey: string; // e.g., 'level1'
}
```

### Victory Scene Data
```typescript
interface IVictorySceneData {
    finalTime: number; // milliseconds
    coinsCollected: number;
}
```

### Game Over Scene Data
```typescript
interface IGameOverSceneData {
    finalTime: number; // milliseconds
    coinsCollected: number;
}
```

---

## Scene Communication Events

Scenes communicate via Phaser's event system for decoupled architecture.

### Global Events (via game.events)
```typescript
// Emitted when player lives change
game.events.emit('lives-changed', lives: number);

// Emitted when coin collected
game.events.emit('coin-collected', totalCoins: number);

// Emitted when checkpoint activated
game.events.emit('checkpoint-activated', checkpoint: ICheckpoint);

// Emitted when boss battle starts
game.events.emit('boss-battle-start');

// Emitted when boss health changes
game.events.emit('boss-health-changed', health: number, maxHealth: number);

// Emitted when boss defeated
game.events.emit('boss-defeated');

// Emitted when player dies
game.events.emit('player-death', livesRemaining: number);

// Emitted when game over
game.events.emit('game-over', data: IGameOverSceneData);

// Emitted when victory
game.events.emit('victory', data: IVictorySceneData);
```

### Scene-Specific Events (via scene.events)
```typescript
// GameScene events
scene.events.on('resume', () => { /* Resume physics */ });
scene.events.on('pause', () => { /* Pause physics */ });
scene.events.on('timer-update', (time: number) => { /* Update HUD */ });
```

---

**Scene Contracts Complete**: 2025-10-31  
**Next**: Entity class contracts
