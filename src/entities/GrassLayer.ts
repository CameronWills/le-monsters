/**
 * Grass Layer Entity
 * Animated grass visual along ground surfaces
 * US1 (Enhanced Visual Experience) - Environmental Layers
 */

import Phaser from 'phaser';
import type { IGrassLayer } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class GrassLayer implements IGrassLayer {
  readonly sprite: Phaser.GameObjects.TileSprite;
  readonly id: string;
  readonly type = 'grass-layer' as const;
  isActive = true;

  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number
  ) {
    this.scene = scene;
    this.id = `grass-${Date.now()}-${Math.random()}`;

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('grass-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create TileSprite for grass (repeating texture)
    // Position at ground level, height from constants
    this.sprite = scene.add.tileSprite(
      x,
      y,
      width,
      GAME_CONFIG.GRASS_HEIGHT,
      'grass-placeholder'
    );
    this.sprite.setOrigin(0, 1); // Anchor at bottom-left
    this.sprite.setDepth(5); // Above ground but below player/enemies

    // Apply sprite scaling for consistency
    this.sprite.setScale(GAME_CONFIG.SPRITE_SCALE);

    // Note: TileSprites don't support play() animation like regular sprites
    // Instead, grass animation is achieved through texture scrolling in update()

    console.log(`[GrassLayer] Created at (${x}, ${y}) with width ${width}`);
  }

  /**
   * Create placeholder texture (green grass)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Draw green grass blades
    graphics.fillStyle(0x2ecc71, 1); // Bright green
    graphics.fillRect(0, 0, 64, GAME_CONFIG.GRASS_HEIGHT);
    
    // Add darker green grass details for texture
    graphics.fillStyle(0x27ae60, 1); // Darker green
    for (let i = 0; i < 64; i += 8) {
      graphics.fillRect(i, 0, 2, GAME_CONFIG.GRASS_HEIGHT);
    }
    
    graphics.generateTexture('grass-placeholder', 64, GAME_CONFIG.GRASS_HEIGHT);
    graphics.destroy();
  }

  /**
   * Update grass layer (handled by animation system)
   */
  update(_delta: number): void {
    // Animation handled by Phaser animation system
    // Could add wind effects or other dynamics here if needed
  }

  /**
   * Destroy grass layer
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
