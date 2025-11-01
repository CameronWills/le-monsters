/**
 * Player Entity (Hugo)
 * Player character with movement, jumping, combat, and state management
 */

import Phaser from 'phaser';
import { GAME_CONFIG, ANIM_KEYS } from '../config/constants';
import type { IPlayer, IEnemy, ICheckpoint, IPlayerProjectile } from '../types/entities';

export class Player implements IPlayer {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'player' as const;
  isActive = true;

  // State properties
  lives = GAME_CONFIG.PLAYER_MAX_LIVES;
  hasWizardHat = false;
  isInvincible = false;
  facingDirection: 1 | -1 = 1;
  isGrounded = false;
  shootCooldown = 0;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.id = `player-${Date.now()}`;

    // Create sprite with physics body
    this.sprite = scene.physics.add.sprite(x, y, 'player-placeholder');
    
    // Store reference to this entity in sprite data
    this.sprite.setData('entity', this);
    
    // Create placeholder graphics (orange rectangle for Hugo)
    this.createPlaceholderGraphics();

    // Setup physics body
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.1);
    this.sprite.setDrag(GAME_CONFIG.PLAYER_ACCELERATION, 0);

    console.log('[Player] Created at', x, y);
  }

  /**
   * Create placeholder graphics (until we have real sprites)
   */
  private createPlaceholderGraphics(): void {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xff6600, 1); // Orange for Hugo
    graphics.fillRect(0, 0, 64, 64);
    graphics.generateTexture('player-placeholder', 64, 64);
    graphics.destroy();
  }

  /**
   * Move player horizontally
   */
  move(direction: -1 | 0 | 1): void {
    if (direction !== 0) {
      this.facingDirection = direction;
      this.sprite.setFlipX(direction === -1);
    }

    const targetVelocityX = direction * GAME_CONFIG.PLAYER_SPEED;
    this.sprite.setVelocityX(targetVelocityX);
  }

  /**
   * Make player jump
   */
  jump(): void {
    if (this.isGrounded) {
      this.sprite.setVelocityY(GAME_CONFIG.PLAYER_JUMP_VELOCITY);
      console.log('[Player] Jump!');
      // TODO: Play jump sound in US1 audio task
    }
  }

  /**
   * Stop horizontal movement
   */
  stop(): void {
    this.sprite.setVelocityX(0);
  }

  /**
   * Shoot wizard staff projectile
   */
  shoot(): IPlayerProjectile | null {
    if (!this.hasWizardHat || this.shootCooldown > 0) {
      return null;
    }

    // TODO: Implement in US2 when we have wizard hat and projectiles
    console.log('[Player] Shoot!');
    this.shootCooldown = GAME_CONFIG.SHOOT_COOLDOWN;
    return null;
  }

  /**
   * Stomp enemy (jump on head)
   */
  stompEnemy(enemy: IEnemy): void {
    // TODO: Implement in US2 when enemies exist
    console.log('[Player] Stomp enemy!');
    enemy.takeDamage();
    // Bounce player upward
    this.sprite.setVelocityY(-300);
  }

  /**
   * Take damage from hazard or enemy
   */
  takeDamage(): void {
    if (this.isInvincible) {
      return;
    }

    this.lives--;
    console.log('[Player] Took damage! Lives remaining:', this.lives);

    if (this.lives <= 0) {
      this.die();
    } else {
      this.triggerDeath();
    }
  }

  /**
   * Trigger death sequence
   */
  private die(): void {
    console.log('[Player] Game Over!');
    // TODO: Transition to Game Over scene in US4
  }

  /**
   * Trigger death animation and respawn
   */
  private triggerDeath(): void {
    console.log('[Player] Death animation...');
    // TODO: Play death animation
    // TODO: Wait 2 seconds then respawn
  }

  /**
   * Respawn at checkpoint
   */
  respawnAtCheckpoint(checkpoint: ICheckpoint): void {
    const pos = checkpoint.getRespawnPosition();
    this.sprite.setPosition(pos.x, pos.y);
    this.sprite.setVelocity(0, 0);
    
    // Reset power-ups
    this.removeWizardHat();
    
    // Grant invincibility
    this.makeInvincible(GAME_CONFIG.PLAYER_INVINCIBILITY_DURATION);
    
    console.log('[Player] Respawned at checkpoint');
  }

  /**
   * Grant temporary invincibility
   */
  makeInvincible(duration: number): void {
    this.isInvincible = true;
    
    // Visual feedback: flashing sprite
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: duration / 200,
      onComplete: () => {
        this.isInvincible = false;
        this.sprite.setAlpha(1);
      },
    });
  }

  /**
   * Collect wizard hat power-up
   */
  collectWizardHat(): void {
    this.hasWizardHat = true;
    console.log('[Player] Collected wizard hat!');
    // TODO: Play power-up sound in US2
  }

  /**
   * Remove wizard hat power-up
   */
  removeWizardHat(): void {
    this.hasWizardHat = false;
    console.log('[Player] Lost wizard hat');
  }

  /**
   * Update animation based on current state
   */
  updateAnimation(): void {
    // TODO: Implement animation state machine when we have sprite sheets
    // Priority: death > jump > fall > run > idle
    
    // For now, just log state changes
    if (this.sprite.body) {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      this.isGrounded = body.touching.down;
    }
  }

  /**
   * Update player state (called every frame)
   */
  update(delta: number): void {
    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= delta;
    }

    // Update animation
    this.updateAnimation();

    // Check for out of bounds (fall into pit)
    if (this.sprite.y > this.scene.physics.world.bounds.height + 100) {
      console.log('[Player] Fell into pit!');
      this.takeDamage();
    }
  }

  /**
   * Destroy player entity
   */
  destroy(): void {
    this.sprite.destroy();
    this.isActive = false;
    console.log('[Player] Destroyed');
  }
}
