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
  }

  /**
   * Register player (Hugo) animations
   * Called by registerAllAnimations
   */
  static registerPlayerAnimations(scene: Phaser.Scene): void {
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
  static registerEnemyAnimations(scene: Phaser.Scene): void {
    // TODO: Implement in US2 tasks
  }

  /**
   * Register boss animations
   */
  static registerBossAnimations(scene: Phaser.Scene): void {
    // TODO: Implement in US3 tasks
  }

  /**
   * Register collectible animations (coins, power-ups)
   */
  static registerCollectibleAnimations(scene: Phaser.Scene): void {
    // TODO: Implement in US1 tasks
  }

  /**
   * Register UI animations (flags, etc.)
   */
  static registerUIAnimations(scene: Phaser.Scene): void {
    // TODO: Implement in US1 tasks
  }
}
