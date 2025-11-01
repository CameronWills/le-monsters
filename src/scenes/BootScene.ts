/**
 * Boot Scene
 * Initial scene that runs on game start
 * Sets up basic configuration and transitions to Preload scene
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  /**
   * Initialize scene
   */
  init(): void {
    console.log('[BootScene] Initializing...');
  }

  /**
   * Preload minimal assets (if any needed for boot)
   */
  preload(): void {
    // No assets needed for boot
  }

  /**
   * Create scene and transition to Preload
   */
  create(): void {
    console.log('[BootScene] Starting...');

    // Configure game settings
    this.configureGame();

    // Transition to Preload scene after brief delay
    this.time.delayedCall(100, () => {
      this.startPreloader();
    });
  }

  /**
   * Configure Phaser game settings
   */
  private configureGame(): void {
    // Configure canvas scaling
    this.scale.displaySize.setAspectRatio(
      this.game.config.width as number / (this.game.config.height as number)
    );
    this.scale.refresh();
  }

  /**
   * Transition to Preload scene
   */
  private startPreloader(): void {
    console.log('[BootScene] Transitioning to Preload...');
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}