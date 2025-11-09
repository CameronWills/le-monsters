/**
 * Animation Manager
 * Centralized sprite animation registration
 */

import Phaser from 'phaser';
import { ANIM_KEYS, ANIMATION_CONFIG, SPRITE_KEYS } from '../config/constants';

export class AnimationManager {
  /**
   * Register all game animations
   * Called in Preload scene after assets are loaded
   */
  static registerAllAnimations(scene: Phaser.Scene): void {
    console.log('[AnimationManager] Registering all animations...');

    // TODO: Implement animation registration in future tasks
    // this.registerPlayerAnimations(scene);
    // this.registerEnemyAnimations(scene);
    // this.registerBossAnimations(scene);
    // this.registerCollectibleAnimations(scene);
    // this.registerUIAnimations(scene);
    
    // NEW: Register frog and environmental animations
    this.createFrogAnimations(scene);
    this.createEnvironmentalAnimations(scene);
    this.createEggAnimation(scene);
  }

  /**
   * Register player (Hugo) animations
   * Called by registerAllAnimations
   */
  static registerPlayerAnimations(_scene: Phaser.Scene): void {
    // TODO: Implement in US1 tasks
    // Example:
    // scene.anims.create({
    //   key: ANIM_KEYS.PLAYER.RUN,
    //   frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.PLAYER, {
    //     start: 0,
    //     end: 7,
    //   }),
    //   frameRate: ANIMATION_CONFIG.PLAYER.RUN_FPS,
    //   repeat: -1,
    // });
  }

  /**
   * Register enemy animations
   */
  static registerEnemyAnimations(_scene: Phaser.Scene): void {
    // TODO: Implement in US2 tasks
  }

  /**
   * Register boss animations
   */
  static registerBossAnimations(_scene: Phaser.Scene): void {
    // TODO: Implement in US3 tasks
  }

  /**
   * Register collectible animations (coins, power-ups)
   */
  static registerCollectibleAnimations(_scene: Phaser.Scene): void {
    // TODO: Implement in US1 tasks
  }

  /**
   * Register UI animations (flags, etc.)
   */
  static registerUIAnimations(_scene: Phaser.Scene): void {
    // TODO: Implement in US1 tasks
  }

  // ==========================================
  // NEW: Frog Enemy Animations (T019)
  // ==========================================

  /**
   * Create frog enemy animations
   * - frog-stationary: 4fps loop (idle animation)
   * - frog-jumping: 10fps no-loop (jump animation)
   */
  static createFrogAnimations(scene: Phaser.Scene): void {
    // Check if frog sprite is loaded
    if (!scene.textures.exists(SPRITE_KEYS.FROG)) {
      console.warn('[AnimationManager] Frog sprite not loaded, skipping animations');
      return;
    }

    // Stationary animation
    if (!scene.anims.exists(ANIM_KEYS.ENEMIES.FROG_STATIONARY)) {
      scene.anims.create({
        key: ANIM_KEYS.ENEMIES.FROG_STATIONARY,
        frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.FROG, { start: 0, end: 1 }),
        frameRate: ANIMATION_CONFIG.ENEMIES.FROG_STATIONARY_FPS,
        repeat: -1,
      });
      console.log('[AnimationManager] Frog stationary animation created');
    }

    // Jumping animation
    if (!scene.anims.exists(ANIM_KEYS.ENEMIES.FROG_JUMPING)) {
      scene.anims.create({
        key: ANIM_KEYS.ENEMIES.FROG_JUMPING,
        frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.FROG, { start: 2, end: 5 }),
        frameRate: ANIMATION_CONFIG.ENEMIES.FROG_JUMPING_FPS,
        repeat: 0, // Play once
      });
      console.log('[AnimationManager] Frog jumping animation created');
    }
  }

  // ==========================================
  // NEW: Environmental Animations (T020)
  // ==========================================

  /**
   * Create environmental animations
   * - grass-wave: 6fps loop with yoyo (waving motion)
   * - water-wave: 8fps loop (wave motion)
   */
  static createEnvironmentalAnimations(scene: Phaser.Scene): void {
    // Grass waving animation
    if (scene.textures.exists(SPRITE_KEYS.GRASS)) {
      if (!scene.anims.exists(ANIM_KEYS.ENVIRONMENTAL.GRASS_WAVE)) {
        scene.anims.create({
          key: ANIM_KEYS.ENVIRONMENTAL.GRASS_WAVE,
          frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.GRASS, { start: 0, end: 5 }),
          frameRate: ANIMATION_CONFIG.ENVIRONMENTAL.GRASS_WAVE_FPS,
          repeat: -1,
          yoyo: true, // Wave back and forth
        });
        console.log('[AnimationManager] Grass wave animation created');
      }
    } else {
      console.warn('[AnimationManager] Grass sprite not loaded, skipping animation');
    }

    // Water wave animation
    if (scene.textures.exists(SPRITE_KEYS.WATER)) {
      if (!scene.anims.exists(ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE)) {
        scene.anims.create({
          key: ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE,
          frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.WATER, { start: 0, end: 7 }),
          frameRate: ANIMATION_CONFIG.ENVIRONMENTAL.WATER_WAVE_FPS,
          repeat: -1,
        });
        console.log('[AnimationManager] Water wave animation created');
      }
    } else {
      console.warn('[AnimationManager] Water sprite not loaded, skipping animation');
    }
  }

  // ==========================================
  // NEW: Egg Projectile Animation (T021)
  // ==========================================

  /**
   * Create bird egg projectile animation
   * - bird-egg-fall: 10fps loop (spinning/tumbling motion while falling)
   */
  static createEggAnimation(scene: Phaser.Scene): void {
    // Check if bird egg sprite is loaded
    if (!scene.textures.exists(SPRITE_KEYS.BIRD_EGG)) {
      console.warn('[AnimationManager] Bird egg sprite not loaded, skipping animation');
      return;
    }

    if (!scene.anims.exists('bird-egg-fall')) {
      scene.anims.create({
        key: 'bird-egg-fall',
        frames: scene.anims.generateFrameNumbers(SPRITE_KEYS.BIRD_EGG, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      console.log('[AnimationManager] Bird egg animation created');
    }
  }
}
