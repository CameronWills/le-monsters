/**
 * Boss Projectile Entity
 * Projectiles fired by the boss in burst patterns
 */

import Phaser from 'phaser';
import type { IBossProjectile } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class BossProjectile implements IBossProjectile {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'projectile-boss' as const;
  isActive = true;

  direction: { x: number; y: number };
  speed: number;
  targetPosition: { x: number; y: number };

  private scene: Phaser.Scene;
  private lifetime = 0;
  private maxLifetime = 10000; // 10 seconds max

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetX: number,
    targetY: number
  ) {
    this.scene = scene;
    this.id = `boss-projectile-${Date.now()}-${Math.random()}`;
    this.speed = GAME_CONFIG.BOSS_PROJECTILE_SPEED;
    this.targetPosition = { x: targetX, y: targetY };

    // Calculate direction toward target
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.direction = {
      x: dx / distance,
      y: dy / distance,
    };

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('boss-projectile-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'boss-projectile-placeholder');
    this.sprite.setOrigin(0.5, 0.5);

    // Disable gravity
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Set velocity toward target
    this.sprite.setVelocity(
      this.direction.x * this.speed,
      this.direction.y * this.speed
    );

    // Store reference to this entity
    this.sprite.setData('entity', this);

    console.log(`[BossProjectile] Created at (${x}, ${y}), targeting (${targetX}, ${targetY})`);
  }

  /**
   * Create placeholder texture (red fireball)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xe74c3c, 1); // Red
    graphics.fillCircle(12, 12, 12);
    graphics.fillStyle(0xff6b6b, 1); // Lighter red center
    graphics.fillCircle(12, 12, 8);
    graphics.fillStyle(0xffa502, 1); // Orange core
    graphics.fillCircle(12, 12, 4);
    graphics.generateTexture('boss-projectile-placeholder', 24, 24);
    graphics.destroy();
  }

  /**
   * Update projectile
   */
  update(delta: number): void {
    if (!this.isActive) return;

    // Track lifetime
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
    // Destroy if exceeded max lifetime
    if (this.lifetime >= this.maxLifetime) {
      return true;
    }

    // Destroy if out of bounds
    const bounds = this.scene.physics.world.bounds;
    const margin = 100;
    
    if (
      this.sprite.x < bounds.left - margin ||
      this.sprite.x > bounds.right + margin ||
      this.sprite.y < bounds.top - margin ||
      this.sprite.y > bounds.bottom + margin
    ) {
      return true;
    }

    return false;
  }

  /**
   * Destroy projectile
   */
  destroy(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.sprite.destroy();
    console.log('[BossProjectile] Destroyed');
  }
}
