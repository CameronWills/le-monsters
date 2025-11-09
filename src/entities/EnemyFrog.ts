/**
 * Frog Enemy Entity
 * Ground-based enemy that jumps toward player, stops at pit edges
 */

import Phaser from 'phaser';
import type { IEnemyFrog } from '../types/entities';
import { GAME_CONFIG, ANIM_KEYS } from '../config/constants';

export class EnemyFrog implements IEnemyFrog {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'enemy-frog' as const;
  isActive = true;
  isAlive = true;
  spawnPosition: { x: number; y: number };

  jumpTimer = 0;
  readonly jumpInterval = GAME_CONFIG.FROG_JUMP_INTERVAL;
  private scene: Phaser.Scene;
  private playerRef: Phaser.Physics.Arcade.Sprite;
  private platforms: Phaser.GameObjects.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerRef: Phaser.Physics.Arcade.Sprite,
    platforms: Phaser.GameObjects.Group
  ) {
    this.scene = scene;
    this.id = `frog-${Date.now()}-${Math.random()}`;
    this.spawnPosition = { x, y };
    this.playerRef = playerRef;
    this.platforms = platforms;

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('frog-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'frog-placeholder');
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setSize(64, 64);

    // Enable gravity for ground-based movement
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    }

    // Store reference to this entity
    this.sprite.setData('entity', this);

    // Play idle animation
    if (scene.anims.exists(ANIM_KEYS.ENEMIES.FROG_STATIONARY)) {
      this.sprite.play(ANIM_KEYS.ENEMIES.FROG_STATIONARY);
    }

    console.log(`[EnemyFrog] Created at (${x}, ${y})`);
  }

  /**
   * Create placeholder texture (green frog)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Green body
    graphics.fillStyle(0x2ecc71, 1);
    graphics.fillCircle(32, 40, 24);
    graphics.fillCircle(20, 32, 16);
    graphics.fillCircle(44, 32, 16);
    
    // Eyes (white with black pupils)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(24, 28, 8);
    graphics.fillCircle(40, 28, 8);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(24, 28, 4);
    graphics.fillCircle(40, 28, 4);
    
    graphics.generateTexture('frog-placeholder', 64, 64);
    graphics.destroy();
  }

  /**
   * Update frog behavior
   */
  update(delta: number): void {
    if (!this.isAlive || !this.isActive) return;

    // Update jump timer
    this.jumpTimer += delta;

    // Check if it's time to jump
    if (this.jumpTimer >= this.jumpInterval && this.isGrounded()) {
      this.attemptJump();
      this.jumpTimer = 0;
    }
  }

  /**
   * Check if frog is on the ground
   */
  private isGrounded(): boolean {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down || body.touching.down;
  }

  /**
   * Attempt to jump toward player, but stop at pit edges
   */
  private attemptJump(): void {
    if (!this.playerRef || !this.isGrounded()) return;

    // Determine direction to player
    const directionToPlayer = this.playerRef.x > this.sprite.x ? 1 : -1;

    // Check for pit edge in jump direction
    if (this.isAtPitEdge(directionToPlayer)) {
      console.log('[EnemyFrog] Stopped at pit edge');
      return; // Don't jump if at edge
    }

    // Perform jump
    const jumpSpeed = GAME_CONFIG.FROG_JUMP_SPEED * directionToPlayer;
    this.sprite.setVelocityX(jumpSpeed);
    this.sprite.setVelocityY(GAME_CONFIG.FROG_JUMP_HEIGHT);

    // Flip sprite to face jump direction
    this.sprite.setFlipX(directionToPlayer === -1);

    // Play jump animation
    if (this.scene.anims.exists(ANIM_KEYS.ENEMIES.FROG_JUMPING)) {
      this.sprite.play(ANIM_KEYS.ENEMIES.FROG_JUMPING);
    }

    console.log(`[EnemyFrog] Jumped ${directionToPlayer === 1 ? 'right' : 'left'}`);
  }

  /**
   * Check if there's a pit edge ahead in the given direction
   */
  private isAtPitEdge(direction: 1 | -1): boolean {
    const checkDistance = GAME_CONFIG.FROG_EDGE_CHECK_DISTANCE;
    const checkX = this.sprite.x + (checkDistance * direction);
    const checkY = this.sprite.y + 40; // Check below frog's feet

    // Raycast down to check for platform
    const platforms = this.platforms.getChildren() as Phaser.Physics.Arcade.Sprite[];
    
    for (const platformSprite of platforms) {
      const platform = platformSprite.getData('entity');
      if (!platform || !platform.isActive) continue;

      const body = platformSprite.body as Phaser.Physics.Arcade.Body;
      
      // Check if the raycast point is above this platform
      if (checkX >= body.left && checkX <= body.right && checkY >= body.top && checkY <= body.bottom + 50) {
        return false; // There's a platform ahead, safe to jump
      }
    }

    return true; // No platform found, it's a pit edge
  }

  /**
   * Take damage from player stomp or projectile
   */
  takeDamage(): void {
    if (!this.isAlive) return;
    this.die();
  }

  /**
   * Frog dies
   */
  die(): void {
    if (!this.isAlive) return;

    this.isAlive = false;
    console.log('[EnemyFrog] Died');

    // Play death animation (fade out and fall)
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y + 50,
      duration: 500,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  /**
   * Respawn frog at original position
   */
  respawn(): void {
    this.sprite.setPosition(this.spawnPosition.x, this.spawnPosition.y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.isAlive = true;
    this.jumpTimer = 0;

    // Play idle animation
    if (this.scene.anims.exists(ANIM_KEYS.ENEMIES.FROG_STATIONARY)) {
      this.sprite.play(ANIM_KEYS.ENEMIES.FROG_STATIONARY);
    }

    console.log('[EnemyFrog] Respawned');
  }

  /**
   * Destroy frog
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
  }
}
