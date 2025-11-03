/**
 * Preload Scene
 * Loads all game assets with progress bar
 */

import Phaser from 'phaser';
import {
  SCENE_KEYS,
  SPRITE_KEYS,
  AUDIO_KEYS,
  ANIM_KEYS,
  ANIMATION_CONFIG,
} from '../config/constants';
import { AnimationManager } from '../managers/AnimationManager';

export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  preload(): void {
    console.log('[PreloadScene] Loading assets...');

    this.createLoadingUI();
    this.setupLoadingEvents();
    this.loadGameAssets();
  }

  create(): void {
    console.log('[PreloadScene] Assets loaded!');
    this.createAnimations();
    this.createParticleTexture();

    // Transition to Main Menu
    this.time.delayedCall(500, () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });
  }

  /**
   * Create loading screen UI
   */
  private createLoadingUI(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // Percent text
    this.percentText = this.add.text(width / 2, height / 2 - 5, '0%', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.percentText.setOrigin(0.5, 0.5);

    // Progress bar box (background)
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2 + 20, 320, 50);

    // Progress bar (fills as assets load)
    this.progressBar = this.add.graphics();
  }

  /**
   * Setup loading progress events
   */
  private setupLoadingEvents(): void {
    this.load.on('progress', (value: number) => {
      this.updateProgressBar(value);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      console.log(`Loading: ${file.key}`);
    });

    this.load.on('complete', () => {
      console.log('[PreloadScene] All assets loaded');
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });
  }

  /**
   * Update progress bar
   */
  private updateProgressBar(progress: number): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.percentText.setText(Math.floor(progress * 100) + '%');

    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(
      width / 2 - 150,
      height / 2 + 30,
      300 * progress,
      30
    );
  }

  /**
   * Load all game assets
   */
  private loadGameAssets(): void {
    // Level data
    this.load.json('level1', 'assets/level-data/level1.json');

    // Player sprite
    this.load.image('player', 'assets/sprites/player.png');
    
    // Player running animation spritesheet
    this.load.spritesheet('player-running', 'assets/sprites/player-running.png', {
      frameWidth: 46,
      frameHeight: 64
    });

    // For now, we'll create placeholder graphics in code
    // In a real implementation, you would load sprite sheets:
    // this.load.spritesheet(SPRITE_KEYS.PLAYER, 'assets/sprites/hugo.png', {
    //   frameWidth: 64,
    //   frameHeight: 64
    // });

    // Audio (placeholder - files don't exist yet)
    // this.load.audio(AUDIO_KEYS.SFX.JUMP, 'assets/audio/sfx/jump.ogg');
    // this.load.audio(AUDIO_KEYS.SFX.COLLECT_COIN, 'assets/audio/sfx/collect-coin.ogg');
    // this.load.audio(AUDIO_KEYS.SFX.PLAYER_DEATH, 'assets/audio/sfx/player-death.ogg');
  }

  /**
   * Register sprite animations
   */
  private createAnimations(): void {
    // Create player running animation
    this.anims.create({
      key: 'player-run',
      frames: this.anims.generateFrameNumbers('player-running', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    
    console.log('[PreloadScene] Animations registered');
  }

  /**
   * Create particle texture for effects
   */
  private createParticleTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
    console.log('[PreloadScene] Particle texture created');
  }
}
