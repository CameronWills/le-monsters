/**
 * Wizard Hat Power-Up Entity
 * Grants player the ability to shoot projectiles
 */

import Phaser from 'phaser';
import type { IPowerUpWizardHat, IPlayer } from '../types/entities';

export class PowerUpWizardHat implements IPowerUpWizardHat {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'power-up-wizard-hat' as const;
  isActive = true;
  isCollected = false;

  spawnPosition: { x: number; y: number };

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.id = `wizard-hat-${Date.now()}`;
    this.spawnPosition = { x, y };

    // Create placeholder texture if it doesn't exist
    if (!scene.textures.exists('wizard-hat-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'wizard-hat-placeholder');
    this.sprite.setOrigin(0.5, 0.5);

    // Disable gravity for floating effect
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Store reference to this entity
    this.sprite.setData('entity', this);

    // Add floating animation
    this.addFloatingAnimation();

    console.log(`[PowerUpWizardHat] Created at (${x}, ${y})`);
  }

  /**
   * Create placeholder texture (purple wizard hat)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Hat cone (purple)
    graphics.fillStyle(0x9b59b6, 1);
    graphics.fillTriangle(8, 24, 24, 0, 40, 24);
    
    // Hat brim (darker purple)
    graphics.fillStyle(0x8e44ad, 1);
    graphics.fillRect(0, 24, 48, 8);
    
    // Stars (yellow)
    graphics.fillStyle(0xf1c40f, 1);
    graphics.fillCircle(16, 12, 2);
    graphics.fillCircle(28, 8, 2);
    graphics.fillCircle(32, 16, 2);
    
    graphics.generateTexture('wizard-hat-placeholder', 48, 32);
    graphics.destroy();
  }

  /**
   * Add floating animation
   */
  private addFloatingAnimation(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Update method (required by interface, but not used)
   */
  update(_delta: number): void {
    // Power-up has no update logic (uses tweens for animation)
  }

  /**
   * Collect the power-up
   */
  collect(player: IPlayer): void {
    if (this.isCollected) return;

    this.isCollected = true;
    this.sprite.setVisible(false);
    
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setEnable(false);
    }

    // Grant player shooting ability
    player.hasWizardHat = true;

    console.log('[PowerUpWizardHat] Collected by player');
  }

  /**
   * Respawn the power-up at original position
   */
  respawn(): void {
    this.isCollected = false;
    this.sprite.setPosition(this.spawnPosition.x, this.spawnPosition.y);
    this.sprite.setVisible(true);
    
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setEnable(true);
    }

    // Restart floating animation
    this.addFloatingAnimation();

    console.log('[PowerUpWizardHat] Respawned');
  }

  /**
   * Destroy the power-up permanently
   */
  destroy(): void {
    this.isActive = false;
    this.sprite.destroy();
    console.log('[PowerUpWizardHat] Destroyed');
  }
}
