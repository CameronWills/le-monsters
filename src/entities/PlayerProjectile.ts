/**
 * Player Projectile Entity
 * Light projectile shot by player when wizard hat is active
 */

import Phaser from 'phaser';
import type { IPlayerProjectile } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class PlayerProjectile implements IPlayerProjectile {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'projectile-player' as const;
  isActive = true;

  direction: { x: number; y: number };
  traveledDistance = 0;
  maxDistance: number;
  speed: number;

  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: 1 | -1
  ) {
    this.scene = scene;
    this.id = `player-projectile-${Date.now()}-${Math.random()}`;
    this.speed = GAME_CONFIG.PROJECTILE_SPEED;
    this.maxDistance = GAME_CONFIG.PROJECTILE_MAX_DISTANCE;
    this.direction = { x: direction, y: 0 };

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('player-projectile-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player-projectile-placeholder');
    this.sprite.setOrigin(0.5, 0.5);

    // Disable gravity
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Set velocity
    this.sprite.setVelocityX(this.speed * direction);

    // Store reference to this entity
    this.sprite.setData('entity', this);

    console.log(`[PlayerProjectile] Created at (${x}, ${y}), direction: ${direction}`);
  }

  /**
   * Create placeholder texture (yellow star)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xf1c40f, 1); // Yellow/gold
    graphics.fillCircle(8, 8, 8);
    graphics.fillStyle(0xffffff, 1); // White center
    graphics.fillCircle(8, 8, 4);
    graphics.generateTexture('player-projectile-placeholder', 20, 20);
    graphics.destroy();
  }

  /**
   * Update projectile
   */
  update(delta: number): void {
    if (!this.isActive) return;

    // Track distance traveled
    const distance = (this.speed * delta) / 1000;
    this.traveledDistance += distance;

    // Check if should be destroyed
    if (this.shouldDestroy()) {
      this.destroy();
    }
  }

  /**
   * Check if projectile should be destroyed
   */
  shouldDestroy(): boolean {
    // Destroy if traveled max distance
    if (this.traveledDistance >= this.maxDistance) {
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
    console.log('[PlayerProjectile] Destroyed');
  }
}
