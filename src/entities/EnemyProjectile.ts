/**
 * Enemy Projectile Entity (Bird Egg)
 * Cream-colored oval eggs dropped by birds
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

    // Use egg texture if available, otherwise fallback to placeholder
    const textureKey = scene.textures.exists('egg') ? 'egg' : 'bird-egg-placeholder';

    // Create bird egg placeholder texture if needed
    if (!scene.textures.exists('bird-egg-placeholder')) {
      this.createEggTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setSize(30, 40); // Oval shape
    this.sprite.setDisplaySize(30, 40);
    
    // Enable gravity (eggs fall like real objects)
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);

    // Set initial velocity
    this.sprite.setVelocity(velocityX, velocityY);

    // Store reference
    this.sprite.setData('entity', this);
    this.sprite.setData('type', 'enemy-projectile');
  }

  /**
   * Create bird egg texture (cream-colored oval)
   */
  private createEggTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Cream/beige color (#FFF8DC)
    graphics.fillStyle(0xfff8dc, 1);
    
    // Draw oval shape (taller than wide)
    graphics.fillEllipse(12, 14, 18, 22);
    
    // Add slight shading on bottom
    graphics.fillStyle(0xf5e6c8, 0.5);
    graphics.fillEllipse(12, 18, 14, 12);
    
    graphics.generateTexture('bird-egg-placeholder', 24, 28);
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

    // Destroy if egg hits the ground (check if below world height)
    const bounds = this.scene.physics.world.bounds;
    if (this.sprite.y > bounds.height) {
      console.log('[EnemyProjectile] Egg fell below world');
      return true;
    }

    // Destroy if out of world bounds horizontally (with margin)
    const margin = 100;
    
    return (
      this.sprite.x < bounds.x - margin ||
      this.sprite.x > bounds.x + bounds.width + margin ||
      this.sprite.y < bounds.y - margin
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
