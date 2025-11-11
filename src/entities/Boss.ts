/**
 * Boss Entity
 * Final enemy with health bar and burst attack pattern
 */

import Phaser from 'phaser';
import type { IBoss, IBossProjectile } from '../types/entities';
import { GAME_CONFIG } from '../config/constants';

export class Boss implements IBoss {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'boss' as const;
  readonly maxHealth = GAME_CONFIG.BOSS_MAX_HEALTH;
  
  isActive = true;
  isAlive = true;
  isVulnerable = true;
  
  health: number;
  attackPhase: 'burst' | 'pause';
  burstShotsFired = 0;
  phaseCooldown = 0;

  private scene: Phaser.Scene;
  private onShootProjectile?: (projectile: IBossProjectile) => void;
  private playerRef?: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerRef: Phaser.Physics.Arcade.Sprite,
    onShootProjectile?: (projectile: IBossProjectile) => void
  ) {
    this.scene = scene;
    this.id = `boss-${Date.now()}`;
    this.health = this.maxHealth;
    this.attackPhase = 'pause'; // Start with pause
    this.phaseCooldown = GAME_CONFIG.BOSS_PAUSE_DURATION;
    this.playerRef = playerRef;
    this.onShootProjectile = onShootProjectile;

    // Use boss texture if available, otherwise fallback to placeholder
    const textureKey = scene.textures.exists('boss') ? 'boss' : 'boss-placeholder';

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('boss-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setOrigin(0.5, 0.5);

    // Disable gravity (boss floats in place)
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      (this.sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }

    // Store reference to this entity
    this.sprite.setData('entity', this);

    console.log(`[Boss] Created at (${x}, ${y}) with ${this.maxHealth} health`);
  }

  /**
   * Create placeholder texture (large purple boss)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Main body (purple)
    graphics.fillStyle(0x6c3483, 1);
    graphics.fillRect(16, 32, 96, 96);
    
    // Eyes (red)
    graphics.fillStyle(0xe74c3c, 1);
    graphics.fillCircle(48, 64, 12);
    graphics.fillCircle(80, 64, 12);
    
    // Pupils (black)
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(48, 64, 6);
    graphics.fillCircle(80, 64, 6);
    
    // Crown (gold)
    graphics.fillStyle(0xf1c40f, 1);
    graphics.fillTriangle(32, 32, 48, 8, 64, 32);
    graphics.fillTriangle(64, 32, 80, 8, 96, 32);
    
    graphics.generateTexture('boss-placeholder', 128, 128);
    graphics.destroy();
  }

  /**
   * Update boss behavior
   */
  update(delta: number): void {
    if (!this.isAlive || !this.isActive) return;

    this.updateAttackPattern(delta);
  }

  /**
   * Update attack pattern (burst shooting with pauses)
   */
  updateAttackPattern(delta: number): void {
    this.phaseCooldown -= delta;

    if (this.attackPhase === 'burst') {
      // Fire shots at intervals during burst
      if (this.phaseCooldown <= 0) {
        if (this.burstShotsFired < GAME_CONFIG.BOSS_BURST_SHOT_COUNT) {
          const projectile = this.shootProjectile();
          if (projectile && this.onShootProjectile) {
            this.onShootProjectile(projectile);
          }
          
          this.burstShotsFired++;
          this.phaseCooldown = GAME_CONFIG.BOSS_BURST_SHOT_INTERVAL;
        } else {
          // Burst complete, switch to pause
          this.switchPhase();
        }
      }
    } else if (this.attackPhase === 'pause') {
      // Wait during pause
      if (this.phaseCooldown <= 0) {
        // Pause complete, switch to burst
        this.switchPhase();
      }
    }
  }

  /**
   * Shoot projectile at player
   */
  shootProjectile(): IBossProjectile {
    // This returns a dummy - actual creation happens via callback
    // The callback in GameScene will create the real BossProjectile
    return {
      sprite: this.sprite, // Dummy
      id: 'temp',
      type: 'projectile-boss',
      isActive: true,
      direction: { x: 0, y: 0 },
      speed: 0,
      targetPosition: { x: 0, y: 0 },
      update: () => {},
      destroy: () => {},
      shouldDestroy: () => false,
    };
  }

  /**
   * Switch between burst and pause phases
   */
  switchPhase(): void {
    if (this.attackPhase === 'burst') {
      this.attackPhase = 'pause';
      this.phaseCooldown = GAME_CONFIG.BOSS_PAUSE_DURATION;
      console.log('[Boss] Switching to PAUSE phase');
    } else {
      this.attackPhase = 'burst';
      this.burstShotsFired = 0;
      this.phaseCooldown = 0; // Shoot immediately
      console.log('[Boss] Switching to BURST phase');
    }
  }

  /**
   * Take damage from player projectile
   */
  takeDamage(amount: number): void {
    if (!this.isAlive || !this.isVulnerable) return;

    this.health = Math.max(0, this.health - amount);
    console.log(`[Boss] Took ${amount} damage. Health: ${this.health}/${this.maxHealth}`);

    // Flash effect
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });

    if (this.health <= 0) {
      this.defeat();
    }
  }

  /**
   * Boss defeated
   */
  defeat(): void {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.isVulnerable = false;

    console.log('[Boss] Defeated!');

    // Death animation
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      angle: 360,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  /**
   * Destroy boss permanently
   */
  destroy(): void {
    this.isActive = false;
    this.sprite.destroy();
    console.log('[Boss] Destroyed');
  }
}
