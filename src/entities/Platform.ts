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
  textureKey: string;

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
    this.textureKey = 'platform-placeholder';

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('platform-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create static sprite
    this.sprite = scene.physics.add.staticSprite(x, y, 'platform-placeholder');
    this.sprite.setOrigin(0, 0); // Set origin to top-left instead of center
    this.sprite.setDisplaySize(width, height);
    this.sprite.refreshBody();

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
    this.isActive = false;
  }
}
