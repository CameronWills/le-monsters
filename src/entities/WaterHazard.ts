/**
 * Water Hazard Entity
 * Animated water visual in pit areas (causes damage/respawn on overlap)
 * US1 (Enhanced Visual Experience) - Environmental Layers
 */

import Phaser from 'phaser';
import type { IWaterHazard } from '../types/entities';

export class WaterHazard implements IWaterHazard {
  readonly sprite: Phaser.GameObjects.TileSprite;
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

    // Use water texture if available, otherwise fallback to placeholder
    const textureKey = scene.textures.exists('water') ? 'water' : 'water-placeholder';

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('water-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create TileSprite for water hazard (repeating texture)
    this.sprite = scene.add.tileSprite(x, y, width, height, textureKey);
    this.sprite.setOrigin(0, 0); // Anchor at top-left
    this.sprite.setDepth(1); // Below most elements but above background

    // Note: TileSprites don't support animations like regular sprites
    // Water animation effect can be achieved through texture scrolling in update()

    console.log(`[WaterHazard] Created at (${x}, ${y}) with size ${width}x${height}`);
  }

  /**
   * Create placeholder texture (ocean blue water)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Ocean blue background (#0077BE)
    graphics.fillStyle(0x0077be, 1);
    graphics.fillRect(0, 0, 64, 64);
    
    // Add some wave-like lines for visual effect
    graphics.lineStyle(2, 0x5dade2, 0.5);
    for (let i = 0; i < 64; i += 10) {
      graphics.beginPath();
      graphics.moveTo(0, i);
      graphics.lineTo(64, i);
      graphics.strokePath();
    }
    
    graphics.generateTexture('water-placeholder', 64, 64);
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
