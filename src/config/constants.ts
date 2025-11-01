/**
 * Game Configuration Constants
 * All magic numbers and configuration values in one place
 */

export const GAME_CONFIG = {
  // === Display ===
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,

  // === Player ===
  PLAYER_SPEED: 200, // Max run speed (pixels/second)
  PLAYER_JUMP_VELOCITY: -500, // Jump strength (negative = upward)
  PLAYER_ACCELERATION: 600, // Acceleration/deceleration rate
  PLAYER_MAX_LIVES: 3,
  PLAYER_INVINCIBILITY_DURATION: 1000, // milliseconds
  PLAYER_RESPAWN_DELAY: 2000, // milliseconds

  // === Shooting ===
  SHOOT_COOLDOWN: 1000, // milliseconds between shots
  PROJECTILE_SPEED: 400, // pixels/second
  PROJECTILE_MAX_DISTANCE: 800, // pixels before auto-destroy

  // === Enemies ===
  BIRD_FLY_SPEED: 100, // pixels/second
  BIRD_DROPPING_COOLDOWN_MIN: 2000, // milliseconds
  BIRD_DROPPING_COOLDOWN_MAX: 5000, // milliseconds
  SHARK_PATROL_SPEED: 80, // pixels/second

  // === Boss ===
  BOSS_MAX_HEALTH: 10,
  BOSS_BURST_SHOT_COUNT: 5, // Number of shots per burst
  BOSS_BURST_SHOT_INTERVAL: 300, // milliseconds between burst shots
  BOSS_PAUSE_DURATION: 2000, // milliseconds between burst cycles
  BOSS_PROJECTILE_SPEED: 300, // pixels/second

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
