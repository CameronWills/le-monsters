/**
 * Enemy Bird Entity
 * Horizontal flying enemy that drops projectiles
 */

import Phaser from 'phaser';
import type { IEnemyBird, IEnemyProjectile } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';
import { EnemyProjectile } from './EnemyProjectile';

export class EnemyBird implements IEnemyBird {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'enemy-bird' as const;
  isActive = true;
  isAlive = true;

  spawnPosition: { x: number; y: number };
  flyDirection: 1 | -1;
  flySpeed: number;
  droppingCooldown: number;
  private droppingTimer = 0;

  private scene: Phaser.Scene;
  private worldBounds: { left: number; right: number };
  private onDropProjectile?: (projectile: IEnemyProjectile) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    flyDirection: 1 | -1 = 1,
    worldWidth: number,
    onDropProjectile?: (projectile: IEnemyProjectile) => void
  ) {
    this.scene = scene;
    this.id = `bird-${Date.now()}-${Math.random()}`;
    this.spawnPosition = { x, y };
    this.flyDirection = flyDirection;
    this.flySpeed = GAME_CONFIG.BIRD_FLY_SPEED;
    this.onDropProjectile = onDropProjectile;

    // Set random dropping cooldown
    this.droppingCooldown = Phaser.Math.Between(
      GAME_CONFIG.BIRD_DROPPING_COOLDOWN_MIN,
      GAME_CONFIG.BIRD_DROPPING_COOLDOWN_MAX
    );
    this.droppingTimer = this.droppingCooldown;

    // Set world bounds for boundary checking
    this.worldBounds = { left: 0, right: worldWidth };

    // Create placeholder texture if needed
    if (!scene.textures.exists('bird-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'bird-placeholder');
    this.sprite.setSize(38, 28);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);


    // Store reference to this entity
    this.sprite.setData('entity', this);

    // Set initial velocity
    this.sprite.setVelocityX(this.flySpeed * this.flyDirection);

    // Flip sprite based on direction
    this.sprite.setFlipX(this.flyDirection === -1);

    console.log(`[EnemyBird] Created at (${x}, ${y}), flying ${flyDirection === 1 ? 'right' : 'left'}`);
  }

  /**
   * Create placeholder texture (purple bird)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x9b59b6, 1); // Purple for bird
    graphics.fillRect(0, 0, 38, 28);
    graphics.fillStyle(0xffffff, 1); // White eye
    graphics.fillCircle(24, 8, 4);
    graphics.generateTexture('bird-placeholder', 38, 28);
    graphics.destroy();
  }

  /**
   * Update bird behavior
   */
  update(delta: number): void {
    if (!this.isAlive || !this.isActive) return;

    // Check world bounds and reverse if needed
    this.checkBounds();

    // Update dropping cooldown
    this.droppingTimer -= delta;

    // Drop projectile when timer expires
    if (this.droppingTimer <= 0) {
      const projectile = this.dropProjectile();
      if (projectile && this.onDropProjectile) {
        this.onDropProjectile(projectile);
      }
    }
  }

  /**
   * Check if bird hit world boundaries
   */
  checkBounds(): void {
    const x = this.sprite.x;

    if (
      (this.flyDirection === 1 && x >= this.worldBounds.right) ||
      (this.flyDirection === -1 && x <= this.worldBounds.left)
    ) {
      // Reverse direction
      this.flyDirection *= -1 as 1 | -1;
      this.sprite.setVelocityX(this.flySpeed * this.flyDirection);
      this.sprite.setFlipX(this.flyDirection === -1);
    }
  }

  /**
   * Drop projectile towards player
   */
  dropProjectile(): IEnemyProjectile {
    // Check if cooldown elapsed
    if (this.droppingTimer > 0) {
      // Return a dummy projectile that immediately destroys itself
      const dummy = new EnemyProjectile(this.scene, -1000, -1000, 0, 0);
      dummy.destroy();
      return dummy;
    }

    // Reset cooldown
    this.droppingTimer = Phaser.Math.Between(
      GAME_CONFIG.BIRD_DROPPING_COOLDOWN_MIN,
      GAME_CONFIG.BIRD_DROPPING_COOLDOWN_MAX
    );

    // Create projectile below bird
    const projectile = new EnemyProjectile(
      this.scene,
      this.sprite.x,
      this.sprite.y + 20,
      0,
      5 // Drop downward
    );

    console.log('[EnemyBird] Dropped projectile');
    return projectile;
  }

  /**
   * Take damage from player
   */
  takeDamage(): void {
    if (!this.isAlive) return;

    this.die();
  }

  /**
   * Kill the bird
   */
  die(): void {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.sprite.setVelocity(0, 0);

    // Death animation (fade out and fall)
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y + 100,
      duration: 500,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.sprite.setVisible(false);
        // Respawn after delay
        this.scene.time.delayedCall(3000, () => {
          this.respawn();
        });
      },
    });

    console.log('[EnemyBird] Died');
  }

  /**
   * Respawn at original position
   */
  respawn(): void {
    this.isAlive = true;
    this.sprite.setPosition(this.spawnPosition.x, this.spawnPosition.y);
    this.sprite.setAlpha(1);
    this.sprite.setVisible(true);
    this.sprite.setVelocityX(this.flySpeed * this.flyDirection);

    console.log('[EnemyBird] Respawned');
  }

  /**
   * Destroy bird
   */
  destroy(): void {
    this.isActive = false;
    this.sprite.destroy();
  }
}
