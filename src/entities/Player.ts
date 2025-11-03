/**
 * Player Entity (Hugo)
 * Player character with movement, jumping, combat, and state management
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
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

  // Visual elements for power-up
  private wizardHatGraphic?: Phaser.GameObjects.Graphics;
  private wizardStaffGraphic?: Phaser.GameObjects.Graphics;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.id = `player-${Date.now()}`;

    // Create sprite with physics body using the running spritesheet
    this.sprite = scene.physics.add.sprite(x, y, 'player-running');
    
    // Set sprite dimensions to match frame size (46x64)
    this.sprite.setSize(46, 64);
    this.sprite.setDisplaySize(46, 64);
    
    // Store reference to this entity in sprite data
    this.sprite.setData('entity', this);

    // Setup physics body
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.1);
    this.sprite.setDrag(GAME_CONFIG.PLAYER_ACCELERATION, 0);

    console.log('[Player] Created at', x, y);
  }

  /**
   * Move player horizontally
   */
  move(direction: -1 | 0 | 1): void {
    if (direction !== 0) {
      this.facingDirection = direction;
      this.sprite.setFlipX(direction === -1);
      
      // Play running animation
      if (this.sprite.anims.currentAnim?.key !== 'player-run') {
        this.sprite.play('player-run');
      }
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
    
    // Stop running animation and show first frame (idle)
    this.sprite.stop();
    this.sprite.setFrame(0);
  }

  /**
   * Shoot wizard staff projectile
   */
  shoot(): IPlayerProjectile | null {
    if (!this.hasWizardHat || this.shootCooldown > 0) {
      return null;
    }

    console.log('[Player] Shoot!');
    this.shootCooldown = GAME_CONFIG.SHOOT_COOLDOWN;
    
    // Return a dummy projectile object to signal that shooting happened
    // The actual projectile will be created by GameScene
    return {} as IPlayerProjectile;
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
    this.showWizardHatVisuals();
    console.log('[Player] Collected wizard hat!');
    // TODO: Play power-up sound in US2
  }

  /**
   * Remove wizard hat power-up
   */
  removeWizardHat(): void {
    this.hasWizardHat = false;
    this.hideWizardHatVisuals();
    console.log('[Player] Lost wizard hat');
  }

  /**
   * Show visual indicators of wizard hat power-up
   */
  private showWizardHatVisuals(): void {
    // Create wizard hat on player's head
    if (!this.wizardHatGraphic) {
      this.wizardHatGraphic = this.scene.add.graphics();
    }
    this.wizardHatGraphic.clear();
    this.wizardHatGraphic.fillStyle(0x9932cc, 1); // Purple wizard hat
    this.wizardHatGraphic.fillTriangle(-10, -40, 0, -60, 10, -40); // Hat cone
    this.wizardHatGraphic.fillRect(-12, -40, 24, 6); // Hat brim
    this.wizardHatGraphic.setDepth(100);

    // Create wizard staff in player's hand
    if (!this.wizardStaffGraphic) {
      this.wizardStaffGraphic = this.scene.add.graphics();
    }
    this.wizardStaffGraphic.clear();
    this.wizardStaffGraphic.lineStyle(3, 0x8b4513, 1); // Brown staff
    this.wizardStaffGraphic.lineBetween(20, 0, 20, -50);
    this.wizardStaffGraphic.fillStyle(0xffff00, 1); // Yellow orb on top
    this.wizardStaffGraphic.fillCircle(20, -55, 5);
    this.wizardStaffGraphic.setDepth(100);

    console.log('[Player] Wizard hat visuals shown');
  }

  /**
   * Hide visual indicators of wizard hat power-up
   */
  private hideWizardHatVisuals(): void {
    if (this.wizardHatGraphic) {
      this.wizardHatGraphic.clear();
      this.wizardHatGraphic.setVisible(false);
    }
    if (this.wizardStaffGraphic) {
      this.wizardStaffGraphic.clear();
      this.wizardStaffGraphic.setVisible(false);
    }
    console.log('[Player] Wizard hat visuals hidden');
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

    // Update wizard hat visuals to follow player
    if (this.hasWizardHat && this.wizardHatGraphic && this.wizardStaffGraphic) {
      const x = this.sprite.x;
      const y = this.sprite.y;
      
      // Position hat on player's head
      this.wizardHatGraphic.setPosition(x, y);
      this.wizardHatGraphic.setVisible(true);
      
      // Position staff in player's hand (flip based on facing direction)
      this.wizardStaffGraphic.setPosition(x, y);
      this.wizardStaffGraphic.setScale(this.facingDirection, 1);
      this.wizardStaffGraphic.setVisible(true);
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
