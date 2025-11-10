/**
 * Preload Scene
 * Loads all game assets with progress bar
 */

import Phaser from 'phaser';
import {
  SCENE_KEYS,
  SPRITE_KEYS,
  AUDIO_KEYS,
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
      frameWidth: 64,
      frameHeight: 96
    });

    // Ground texture
    this.load.image('ground', 'assets/sprites/ground.png');

    // platform texture
    this.load.image('platform', 'assets/sprites/platform.png');

    // water texture
    this.load.image('water', 'assets/sprites/water.png');

    // coin texture
    this.load.image('coin', 'assets/sprites/coin.png');

    // cloud textures
    this.load.image('clouds', 'assets/sprites/clouds.png');

    // egg projectile texture
    this.load.image('egg', 'assets/sprites/egg.png');


    // ==========================================
    // NEW: Frog Enemy Sprite (T013)
    // ==========================================
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`[PreloadScene] Failed to load: ${file.key} from ${file.url}`);
    });

    // Frog enemy sprite sheet - TODO: Create asset file
    this.load.spritesheet(SPRITE_KEYS.FROG, 'assets/sprites/frog.png', {
      frameWidth: 64, // Adjust based on actual sprite size
      frameHeight: 64,
    });

    // ==========================================
    // NEW: Environmental Graphics (T014-T016)
    // ==========================================

    // Grass layer sprite sheet - TODO: Create asset file
    this.load.spritesheet(SPRITE_KEYS.GRASS, 'assets/sprites/grass-layer.png', {
      frameWidth: 64, // Will tile horizontally
      frameHeight: 30, // MUST be exactly 30px
    });

    // Water animation sprite sheet - TODO: Create asset file
    this.load.spritesheet(SPRITE_KEYS.WATER, 'assets/sprites/water-animation.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Cloud parallax sprite/tile - TODO: Create asset file
    this.load.image(SPRITE_KEYS.CLOUDS, 'assets/sprites/clouds.png');

    // ==========================================
    // NEW: Bird Egg Sprite (T017)
    // ==========================================

    // Bird egg projectile sprite sheet - TODO: Create asset file
    this.load.spritesheet(SPRITE_KEYS.BIRD_EGG, 'assets/sprites/bird-egg.png', {
      frameWidth: 32, // Adjust based on actual sprite size
      frameHeight: 32,
    });

    // ==========================================
    // NEW: Audio Files (T018)
    // ==========================================

    // Frog sound effects - TODO: Create audio files
    this.load.audio(AUDIO_KEYS.SFX.FROG_JUMP, 'assets/audio/sfx/frog-jump.ogg');
    this.load.audio(AUDIO_KEYS.SFX.FROG_DEFEAT, 'assets/audio/sfx/frog-defeat.ogg');

    // Egg impact sound - TODO: Create audio file
    this.load.audio(AUDIO_KEYS.SFX.EGG_IMPACT, 'assets/audio/sfx/egg-impact.ogg');

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
    
    // Register all new animations using AnimationManager
    AnimationManager.registerAllAnimations(this);
    
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
