/**
 * Game Configuration Constants
 * All magic numbers and configuration values in one place
 */

export const GAME_CONFIG = {
  // === Display ===
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,

  // === Player ===
  PLAYER_SPEED: 250, // Max run speed (pixels/second)
  PLAYER_JUMP_VELOCITY: -600, // Jump strength (negative = upward) - increased for better platforming
  PLAYER_ACCELERATION: 600, // Acceleration/deceleration rate
  PLAYER_MAX_LIVES: 3,
  PLAYER_INVINCIBILITY_DURATION: 1000, // milliseconds
  PLAYER_RESPAWN_DELAY: 2000, // milliseconds

  // === Shooting ===
  SHOOT_COOLDOWN: 1000, // milliseconds between shots
  PROJECTILE_SPEED: 400, // pixels/second
  PROJECTILE_MAX_DISTANCE: 800, // pixels before auto-destroy

  // === Enemies ===
  BIRD_FLY_SPEED: 70, // pixels/second
  BIRD_DROPPING_COOLDOWN_MIN: 3000, // milliseconds
  BIRD_DROPPING_COOLDOWN_MAX: 7000, // milliseconds
  SHARK_PATROL_SPEED: 80, // pixels/second

  // === Frog Enemy (NEW) ===
  FROG_JUMP_INTERVAL: 2000, // milliseconds between jumps (MUST be exactly 2000ms)
  FROG_JUMP_SPEED: 100, // horizontal jump speed (pixels/second)
  FROG_JUMP_HEIGHT: -250, // vertical jump velocity (negative = upward)
  FROG_EDGE_CHECK_DISTANCE: 20, // pixels ahead to check for platform edge

  // === Environmental (NEW) ===
  GRASS_HEIGHT: 30, // pixels
  CLOUD_SCROLL_FACTOR: 0.2, // 50% of camera speed

  // === Boss ===
  BOSS_MAX_HEALTH: 5,
  BOSS_BURST_SHOT_COUNT: 2, // Number of shots per burst
  BOSS_BURST_SHOT_INTERVAL: 300, // milliseconds between burst shots
  BOSS_PAUSE_DURATION: 4000, // milliseconds between burst cycles
  BOSS_PROJECTILE_SPEED: 200, // pixels/second

  // === Platforms ===
  MOVING_PLATFORM_SPEED: 50, // pixels/second

  // === Physics ===
  GRAVITY: 800, // pixels/second² downward acceleration

  // === Input ===
  JUMP_BUFFER_FRAMES: 5, // Frames to buffer jump input
  COYOTE_TIME_MS: 100, // milliseconds of jump allowance after leaving platform

  // === Camera ===
  CAMERA_LERP_SPEED: 0.1, // Smoothness of camera follow (0-1)
  CAMERA_SHAKE_INTENSITY: 0.005, // Shake intensity on impacts

  // === Performance ===
  TARGET_FPS: 60,
  PROJECTILE_POOL_SIZE_PLAYER: 50, // Pre-created player projectiles
  PROJECTILE_POOL_SIZE_ENEMY: 30, // Pre-created enemy projectiles
  PROJECTILE_POOL_SIZE_BOSS: 20, // Pre-created boss projectiles
} as const;

/**
 * Animation Configuration
 * Frame rates and timing for sprite animations
 */
export const ANIMATION_CONFIG = {
  PLAYER: {
    IDLE_FPS: 8,
    RUN_FPS: 12,
    JUMP_FPS: 10,
    FALL_FPS: 10,
    DEATH_FPS: 8,
  },
  ENEMIES: {
    BIRD_FLY_FPS: 10,
    SHARK_SWIM_FPS: 8,
    FROG_STATIONARY_FPS: 4, // Frog idle animation
    FROG_JUMPING_FPS: 10, // Frog jump animation
  },
  ENVIRONMENTAL: {
    GRASS_WAVE_FPS: 6, // Grass waving animation
    WATER_WAVE_FPS: 8, // Water wave animation
  },
  BOSS: {
    IDLE_FPS: 6,
    ATTACK_FPS: 12,
    HURT_FPS: 10,
    DEATH_FPS: 8,
  },
  COLLECTIBLES: {
    COIN_SPIN_FPS: 10,
    WIZARD_HAT_FLOAT_FPS: 6,
  },
  UI: {
    FLAG_RAISE_FPS: 12,
  },
} as const;

/**
 * Audio Asset Keys
 */
export const AUDIO_KEYS = {
  MUSIC: {
    GAMEPLAY: 'music-gameplay',
    BOSS: 'music-boss',
    VICTORY: 'music-victory',
  },
  SFX: {
    JUMP: 'sfx-jump',
    LAND: 'sfx-land',
    COLLECT_COIN: 'sfx-collect-coin',
    COLLECT_POWERUP: 'sfx-collect-powerup',
    SHOOT: 'sfx-shoot',
    ENEMY_DEFEAT: 'sfx-enemy-defeat',
    PLAYER_DEATH: 'sfx-player-death',
    CHECKPOINT: 'sfx-checkpoint',
    BOSS_HIT: 'sfx-boss-hit',
    BOSS_DEFEAT: 'sfx-boss-defeat',
    FROG_JUMP: 'sfx-frog-jump', // NEW: Frog jump sound
    FROG_DEFEAT: 'sfx-frog-defeat', // NEW: Frog defeat sound
    EGG_IMPACT: 'sfx-egg-impact', // NEW: Egg hitting ground sound
  },
} as const;

/**
 * Sprite Asset Keys
 */
export const SPRITE_KEYS = {
  PLAYER: 'hugo',
  ENEMIES: 'enemies',
  BOSS: 'boss',
  COLLECTIBLES: 'collectibles',
  PLATFORMS: 'platforms',
  UI: 'ui',
  BACKGROUND: 'forest-bg',
  FROG: 'frog', // NEW: Frog enemy sprite
  GRASS: 'grass-layer', // NEW: Grass animation sprite
  WATER: 'water-animation', // NEW: Water animation sprite
  CLOUDS: 'clouds', // NEW: Cloud parallax sprite
  BIRD_EGG: 'bird-egg', // NEW: Bird egg projectile sprite
} as const;

/**
 * Animation Keys
 */
export const ANIM_KEYS = {
  PLAYER: {
    IDLE: 'hugo-idle',
    RUN: 'hugo-run',
    JUMP: 'hugo-jump',
    FALL: 'hugo-fall',
    DEATH: 'hugo-death',
  },
  ENEMIES: {
    BIRD_FLY: 'bird-fly',
    SHARK_SWIM: 'shark-swim',
    FROG_STATIONARY: 'frog-stationary', // NEW: Frog idle animation
    FROG_JUMPING: 'frog-jumping', // NEW: Frog jump animation
  },
  ENVIRONMENTAL: {
    GRASS_WAVE: 'grass-wave', // NEW: Grass waving animation
    WATER_WAVE: 'water-wave', // NEW: Water wave animation
  },
  BOSS: {
    IDLE: 'boss-idle',
    ATTACK: 'boss-attack',
    HURT: 'boss-hurt',
    DEATH: 'boss-death',
  },
  COLLECTIBLES: {
    COIN_SPIN: 'coin-spin',
    WIZARD_HAT_FLOAT: 'wizard-hat-float',
  },
  UI: {
    FLAG_RAISE: 'flag-raise',
  },
} as const;

/**
 * Scene Keys
 */
export const SCENE_KEYS = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MAIN_MENU: 'MainMenuScene',
  ABOUT: 'AboutScene',
  GAME: 'GameScene',
  PAUSE: 'PauseScene',
  VICTORY: 'VictoryScene',
  GAME_OVER: 'GameOverScene',
} as const;

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  SAVE_DATA: 'le-monsters-save',
} as const;

/**
 * Layer Depths (Z-index)
 * Higher numbers render on top
 */
export const DEPTHS = {
  BACKGROUND: 0,
  PLATFORMS: 10,
  COLLECTIBLES: 20,
  ENEMIES: 30,
  PLAYER: 40,
  PROJECTILES: 50,
  BOSS: 60,
  HUD: 100,
  UI: 200,
} as const;

/**
 * Collision Categories (bitmask flags)
 */
export enum CollisionCategory {
  NONE = 0,
  PLAYER = 1 << 0, // 0x0001
  ENEMY = 1 << 1, // 0x0002
  PLAYER_PROJECTILE = 1 << 2, // 0x0004
  ENEMY_PROJECTILE = 1 << 3, // 0x0008
  BOSS = 1 << 4, // 0x0010
  PLATFORM = 1 << 5, // 0x0020
  COLLECTIBLE = 1 << 6, // 0x0040
}
