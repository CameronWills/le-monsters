/**
 * Enemy Shark Entity
 * Vertically patrolling enemy in water sections
 */

import Phaser from 'phaser';
import type { IEnemyShark } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class EnemyShark implements IEnemyShark {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'enemy-shark' as const;
  isActive = true;
  isAlive = true;

  spawnPosition: { x: number; y: number };
  patrolStart: number;
  patrolEnd: number;
  patrolSpeed: number;
  patrolDirection: 1 | -1;

  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrolStart: number,
    patrolEnd: number
  ) {
    this.scene = scene;
    this.id = `shark-${Date.now()}-${Math.random()}`;
    this.spawnPosition = { x, y };
    this.patrolStart = patrolStart;
    this.patrolEnd = patrolEnd;
    this.patrolSpeed = GAME_CONFIG.SHARK_PATROL_SPEED;
    this.patrolDirection = 1; // Start moving right

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('shark-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'shark-placeholder');
    this.sprite.setOrigin(0.5, 0.5);

    // Disable gravity for patrol (sharks float in water)
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Store reference to this entity
    this.sprite.setData('entity', this);

    // Set initial velocity (horizontal patrol)
    this.sprite.setVelocityX(this.patrolSpeed * this.patrolDirection);

    console.log(
      `[EnemyShark] Created at (${x}, ${y}), patrol ${patrolStart} to ${patrolEnd}`
    );
  }

  /**
   * Create placeholder texture (blue shark)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x3498db, 1); // Blue for shark
    graphics.fillRect(0, 0, 48, 32);
    graphics.fillStyle(0xffffff, 1); // White eye
    graphics.fillCircle(38, 10, 4);
    graphics.fillStyle(0xe74c3c, 1); // Red fin
    graphics.fillTriangle(24, 0, 24, 8, 32, 4);
    graphics.generateTexture('shark-placeholder', 48, 32);
    graphics.destroy();
  }

  /**
   * Update shark behavior
   */
  update(_delta: number): void {
    if (!this.isAlive || !this.isActive) return;

    // Check patrol boundaries and reverse if needed
    if (this.isAtBoundary()) {
      this.reverseDirection();
    }
  }

  /**
   * Check if shark is at patrol boundary
   */
  isAtBoundary(): boolean {
    if (this.patrolDirection === 1) {
      // Moving right
      return this.sprite.x >= this.patrolEnd;
    } else {
      // Moving left
      return this.sprite.x <= this.patrolStart;
    }
  }

  /**
   * Reverse patrol direction
   */
  reverseDirection(): void {
    this.patrolDirection = this.patrolDirection === 1 ? -1 : 1;
    this.sprite.setVelocityX(this.patrolSpeed * this.patrolDirection);

    // Flip sprite horizontally based on direction
    this.sprite.setFlipX(this.patrolDirection === -1);

    console.log(
      `[EnemyShark] Reversed direction, now moving ${this.patrolDirection === 1 ? 'right' : 'left'}`
    );
  }

  /**
   * Take damage from player
   */
  takeDamage(): void {
    if (!this.isAlive) return;

    console.log('[EnemyShark] Taking damage');
    this.die();
  }

  /**
   * Shark dies
   */
  die(): void {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.sprite.setVelocity(0, 0);

    console.log('[EnemyShark] Died');

    // Death animation: fade out and fall
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y + 100,
      duration: 800,
      ease: 'Power2'
    });
  }

  /**
   * Respawn shark at original position
   */
  respawn(): void {
    this.isAlive = true;
    this.sprite.setPosition(this.spawnPosition.x, this.spawnPosition.y);
    this.sprite.setAlpha(1);
    this.patrolDirection = 1; // Reset to moving right
    this.sprite.setVelocityX(this.patrolSpeed * this.patrolDirection);
    this.sprite.setFlipX(false);

    console.log('[EnemyShark] Respawned');
  }

  /**
   * Destroy shark permanently
   */
  destroy(): void {
    this.isActive = false;
    this.sprite.destroy();
    console.log('[EnemyShark] Destroyed');
  }
}
