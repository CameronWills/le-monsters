/**
 * Platform Entity
 * Static platforms for player to stand on
 */

import Phaser from 'phaser';
import type { IPlatform } from '../types/entities';

export class Platform implements IPlatform {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'platform-static' as const;
  isActive = true;

  width: number;
  height: number;
  private tileSprite?: Phaser.GameObjects.TileSprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.id = `platform-${Date.now()}-${Math.random()}`;
    this.width = width;
    this.height = height;

    const type = height > 50 ? 'ground' : 'platform';

    // Use ground texture if available, otherwise fallback to placeholder
    const textureKey = scene.textures.exists(type) ? type : 'platform-placeholder';
    
    // Create placeholder texture if needed (fallback)
    if (!scene.textures.exists('platform-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create invisible physics sprite for collision detection
    this.sprite = scene.physics.add.staticSprite(x, y, textureKey);
    this.sprite.setOrigin(0, 0);
    this.sprite.setAlpha(0); // Make invisible
    this.sprite.setDisplaySize(width, height);
    this.sprite.refreshBody();

    // Create TileSprite for visual (repeating texture)
    this.tileSprite = scene.add.tileSprite(x, y, width, height, textureKey);
    this.tileSprite.setOrigin(0, 0);
    this.tileSprite.setDepth(10); // Same depth as platforms

    // Store reference to this entity in sprite data
    this.sprite.setData('entity', this);
  }

  /**
   * Create placeholder texture (brown rectangle)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x8b4513, 1); // Brown for platforms
    graphics.fillRect(0, 0, 100, 20);
    graphics.generateTexture('platform-placeholder', 100, 20);
    graphics.destroy();
  }

  /**
   * Update platform (static platforms don't update)
   */
  update(_delta: number): void {
    // Static platforms don't need updates
  }

  /**
   * Destroy platform
   */
  destroy(): void {
    this.sprite.destroy();
    if (this.tileSprite) {
      this.tileSprite.destroy();
    }
    this.isActive = false;
  }
}
