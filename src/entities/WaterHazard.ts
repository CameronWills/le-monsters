/**
 * Water Hazard Entity
 * Animated water visual in pit areas (causes damage/respawn on overlap)
 * US1 (Enhanced Visual Experience) - Environmental Layers
 */

import Phaser from 'phaser';
import type { IWaterHazard } from '../types/entities';
import { GAME_CONFIG, ANIM_KEYS } from '../config/constants';

export class WaterHazard implements IWaterHazard {
  readonly sprite: Phaser.GameObjects.Sprite;
  readonly id: string;
  readonly type = 'water-hazard' as const;
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
    this.id = `water-${Date.now()}-${Math.random()}`;

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('water-placeholder')) {
      this.createPlaceholderTexture(scene, width, height);
    }

    // Create sprite for water hazard
    this.sprite = scene.add.sprite(x, y, 'water-placeholder');
    this.sprite.setOrigin(0, 0); // Anchor at top-left
    this.sprite.setDisplaySize(width, height);
    this.sprite.setDepth(1); // Below most elements but above background

    // Apply sprite scaling for consistency
    this.sprite.setScale(GAME_CONFIG.SPRITE_SCALE);

    // Play water wave animation if available
    if (scene.anims.exists(ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE)) {
      this.sprite.play(ANIM_KEYS.ENVIRONMENTAL.WATER_WAVE);
    }

    console.log(`[WaterHazard] Created at (${x}, ${y}) with size ${width}x${height}`);
  }

  /**
   * Create placeholder texture (ocean blue water)
   */
  private createPlaceholderTexture(
    scene: Phaser.Scene,
    width: number,
    height: number
  ): void {
    const graphics = scene.add.graphics();
    
    // Ocean blue background (#0077BE)
    graphics.fillStyle(0x0077be, 1);
    graphics.fillRect(0, 0, width, height);
    
    // Add some wave-like lines for visual effect
    graphics.lineStyle(2, 0x5dade2, 0.5);
    for (let i = 0; i < height; i += 10) {
      graphics.beginPath();
      graphics.moveTo(0, i);
      graphics.lineTo(width, i);
      graphics.strokePath();
    }
    
    graphics.generateTexture('water-placeholder', width, height);
    graphics.destroy();
  }

  /**
   * Update water hazard (animation handled by Phaser)
   */
  update(_delta: number): void {
    // Animation handled by Phaser animation system
    // Could add ripple effects or other dynamics here if needed
  }

  /**
   * Destroy water hazard
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
