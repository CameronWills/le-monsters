/**
 * Checkpoint Entity
 * Auto-save points for respawn
 */

import Phaser from 'phaser';
import type { ICheckpoint } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class Checkpoint implements ICheckpoint {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'checkpoint' as const;
  isActive = true;
  isActivated = false;
  flagSprite!: Phaser.GameObjects.Sprite;

  private scene: Phaser.Scene;
  private position: { x: number; y: number };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.id = `checkpoint-${Date.now()}-${Math.random()}`;
    this.position = { x, y };

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('checkpoint-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite (non-physical, just for overlap detection)
    this.sprite = scene.physics.add.sprite(x, y, 'checkpoint-placeholder');
    this.sprite.setSize(48, 96);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Store reference to this entity in sprite data
    this.sprite.setData('entity', this);

    // Create flag sprite (visual indicator)
    this.flagSprite = scene.add.sprite(x, y - 48, 'checkpoint-placeholder');
    this.flagSprite.setTint(0xff0000); // Red when inactive
  }

  /**
   * Create placeholder texture (pole with flag)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Pole (gray)
    graphics.fillStyle(0x808080, 1);
    graphics.fillRect(18, 0, 4, 80);
    
    // Flag (will be tinted red/green)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(22, 10, 20, 15);
    
    graphics.generateTexture('checkpoint-placeholder', 40, 80);
    graphics.destroy();
  }

  /**
   * Activate checkpoint
   */
  activate(): void {
    if (this.isActivated) {
      return;
    }

    this.isActivated = true;
    console.log('[Checkpoint] Activated!');

    // Change flag color to green
    this.flagSprite.setTint(0x00ff00);

    // Play flag raise animation
    this.scene.tweens.add({
      targets: this.flagSprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
    });

    // TODO: Play checkpoint sound in US1 audio task
    // TODO: Emit event for checkpoint activation
  }

  /**
   * Get respawn position
   */
  getRespawnPosition(): { x: number; y: number } {
    return { ...this.position };
  }

  /**
   * Update checkpoint
   */
  update(_delta: number): void {
    // Checkpoints don't need updates (activation is event-based)
  }

  /**
   * Destroy checkpoint
   */
  destroy(): void {
    this.sprite.destroy();
    this.flagSprite.destroy();
    this.isActive = false;
  }
}
