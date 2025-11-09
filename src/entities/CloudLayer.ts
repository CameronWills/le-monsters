/**
 * Cloud Layer Entity
 * Parallax scrolling cloud background
 * US1 (Enhanced Visual Experience) - Environmental Layers
 */

import Phaser from 'phaser';
import type { ICloudLayer } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class CloudLayer implements ICloudLayer {
  readonly sprite: Phaser.GameObjects.TileSprite;
  readonly id: string;
  readonly type = 'cloud-layer' as const;
  isActive = true;

  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.scene = scene;
    this.id = `clouds-${Date.now()}`;

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('clouds-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create TileSprite for repeating cloud pattern
    this.sprite = scene.add.tileSprite(
      x,
      y,
      width,
      height,
      'clouds-placeholder'
    );
    this.sprite.setOrigin(0, 0); // Anchor at top-left
    this.sprite.setDepth(0); // Background layer (behind everything)

    // Apply sprite scaling for consistency
    this.sprite.setScale(GAME_CONFIG.SPRITE_SCALE);

    // Set scroll factor for parallax effect
    // Clouds scroll slower than camera (0.5 = half speed)
    this.sprite.setScrollFactor(GAME_CONFIG.CLOUD_SCROLL_FACTOR);

    console.log(`[CloudLayer] Created at (${x}, ${y}) with size ${width}x${height}`);
  }

  /**
   * Create placeholder texture (white clouds on light blue sky)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Light blue sky background
    graphics.fillStyle(0x87ceeb, 1);
    graphics.fillRect(0, 0, 256, 256);
    
    // White clouds (simple circles)
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(64, 80, 30);
    graphics.fillCircle(90, 80, 35);
    graphics.fillCircle(110, 80, 25);
    
    graphics.fillCircle(180, 160, 28);
    graphics.fillCircle(200, 160, 32);
    graphics.fillCircle(220, 160, 28);
    
    graphics.generateTexture('clouds-placeholder', 256, 256);
    graphics.destroy();
  }

  /**
   * Update parallax scrolling based on camera position
   */
  updateParallax(cameraScrollX: number): void {
    // Scroll cloud texture at half the speed of camera movement
    this.sprite.tilePositionX = cameraScrollX * GAME_CONFIG.CLOUD_SCROLL_FACTOR;
  }

  /**
   * Update cloud layer
   */
  update(_delta: number): void {
    // Parallax is updated by GameScene calling updateParallax()
    // No per-frame logic needed here
  }

  /**
   * Destroy cloud layer
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
