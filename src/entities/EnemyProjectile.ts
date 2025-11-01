/**
 * Enemy Projectile Entity
 * Projectiles fired by enemies (birds and boss)
 */

import Phaser from 'phaser';
import type { IEnemyProjectile } from '../types/entities';

export class EnemyProjectile implements IEnemyProjectile {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'projectile-enemy' as const;
  isActive = true;

  speed: number;
  direction: { x: number; y: number };

  private scene: Phaser.Scene;
  private maxLifetime = 5000; // 5 seconds max
  private lifetime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number
  ) {
    this.scene = scene;
    this.id = `enemy-projectile-${Date.now()}-${Math.random()}`;
    this.speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    this.direction = { x: velocityX / this.speed, y: velocityY / this.speed };

    // Create placeholder texture if needed
    if (!scene.textures.exists('enemy-projectile-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'enemy-projectile-placeholder');
    this.sprite.setSize(12, 12);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Set velocity
    this.sprite.setVelocity(velocityX, velocityY);

    // Store reference
    this.sprite.setData('entity', this);
    this.sprite.setData('type', 'enemy-projectile');
  }

  /**
   * Create placeholder texture (red circle)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xff0000, 1); // Red for enemy projectile
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture('enemy-projectile-placeholder', 12, 12);
    graphics.destroy();
  }

  /**
   * Update projectile
   */
  update(delta: number): void {
    if (!this.isActive) return;

    this.lifetime += delta;

    // Check if should be destroyed
    if (this.shouldDestroy()) {
      this.destroy();
    }
  }

  /**
   * Check if projectile should be destroyed
   */
  shouldDestroy(): boolean {
    // Destroy after max lifetime
    if (this.lifetime >= this.maxLifetime) {
      return true;
    }

    // Destroy if out of world bounds (with margin)
    const bounds = this.scene.physics.world.bounds;
    const margin = 100;
    
    return (
      this.sprite.x < bounds.x - margin ||
      this.sprite.x > bounds.x + bounds.width + margin ||
      this.sprite.y < bounds.y - margin ||
      this.sprite.y > bounds.y + bounds.height + margin
    );
  }

  /**
   * Destroy projectile
   */
  destroy(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.sprite.destroy();
  }
}
