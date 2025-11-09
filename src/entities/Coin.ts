/**
 * Coin Entity
 * Collectible coins that add to score
 */

import Phaser from 'phaser';
import type { ICoin, IPlayer } from '../types/entities';

export class Coin implements ICoin {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'coin' as const;
  isActive = true;
  isCollected = false;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.id = `coin-${Date.now()}-${Math.random()}`;

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('coin-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'coin-placeholder');
    this.sprite.setSize(28, 28);
    
    // Store reference to this entity in sprite data
    this.sprite.setData('entity', this);
    
    // Make coin not affected by gravity
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Add simple floating animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Create placeholder texture (yellow circle)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xffff00, 1); // Yellow for coins
    graphics.fillCircle(16, 16, 12);
    graphics.generateTexture('coin-placeholder', 32, 32);
    graphics.destroy();
  }

  /**
   * Collect coin
   */
  collect(_player: IPlayer): void {
    if (this.isCollected) {
      return;
    }

    this.isCollected = true;
    console.log('[Coin] Collected!');

    // Play collection animation
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    });

    // TODO: Play coin sound in US1 audio task
    // TODO: Emit event for HUD update
  }

  /**
   * Update coin
   */
  update(_delta: number): void {
    // Coin animation handled by tweens
  }

  /**
   * Destroy coin
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
