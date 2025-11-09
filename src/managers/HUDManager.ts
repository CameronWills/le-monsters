/**
 * HUD Manager
 * Display and update heads-up display
 */

import Phaser from 'phaser';
import { DEPTHS } from '../config/constants';

export class HUDManager {
  private scene!: Phaser.Scene;
  private livesText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private bossHealthBar!: Phaser.GameObjects.Graphics;
  private bossHealthBarBg!: Phaser.GameObjects.Graphics;
  private bossHealthText!: Phaser.GameObjects.Text;

  /**
   * Initialize HUD
   */
  init(scene: Phaser.Scene): void {
    this.scene = scene;

    const padding = 20;
    const cameraWidth = scene.cameras.main.width;
    const centerX = cameraWidth / 2;

    // Lives display (top-left)
    this.livesText = scene.add.text(padding, padding, 'Lives: 3', {
      fontSize: '42px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.livesText.setScrollFactor(0).setDepth(DEPTHS.HUD);

    // Timer display (top-center) - removed "Time:" prefix per requirements
    this.timerText = scene.add.text(centerX, padding, '00:00', {
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.timerText.setOrigin(0.5, 0).setScrollFactor(0).setDepth(DEPTHS.HUD);

    // Coins display (top-right)
    this.coinsText = scene.add.text(cameraWidth - padding, padding, 'Coins: 0', {
      fontSize: '42px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.coinsText.setOrigin(1, 0).setScrollFactor(0).setDepth(DEPTHS.HUD);

    console.log('[HUDManager] Initialized');
  }

  /**
   * Update lives display
   */
  updateLives(lives: number): void {
    this.livesText.setText(`Lives: ${lives}`);
  }

  /**
   * Update coins display
   */
  updateCoins(coins: number): void {
    this.coinsText.setText(`Coins: ${coins}`);
  }

  /**
   * Update timer display
   */
  updateTimer(formattedTime: string): void {
    this.timerText.setText(formattedTime); // No "Time:" prefix
  }

  /**
   * Show boss health bar
   */
  showBossHealthBar(): void {
    const centerX = this.scene.cameras.main.width / 2;
    const y = 50;

    // Background bar
    this.bossHealthBarBg = this.scene.add.graphics();
    this.bossHealthBarBg.fillStyle(0x000000, 0.8);
    this.bossHealthBarBg.fillRect(centerX - 210, y - 5, 420, 30);
    this.bossHealthBarBg.setScrollFactor(0).setDepth(DEPTHS.HUD);

    // Health bar (filled)
    this.bossHealthBar = this.scene.add.graphics();
    this.bossHealthBar.setScrollFactor(0).setDepth(DEPTHS.HUD);

    // Boss health text
    this.bossHealthText = this.scene.add.text(centerX, y + 10, 'Boss: 10/10', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.bossHealthText.setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.HUD + 1);

    console.log('[HUDManager] Boss health bar shown');
  }

  /**
   * Hide boss health bar
   */
  hideBossHealthBar(): void {
    if (this.bossHealthBar) {
      this.bossHealthBar.destroy();
      this.bossHealthBarBg.destroy();
      this.bossHealthText.destroy();
    }
  }

  /**
   * Update boss health bar
   */
  updateBossHealth(health: number, maxHealth: number): void {
    if (!this.bossHealthBar) {
      return;
    }

    const centerX = this.scene.cameras.main.width / 2;
    const y = 50;
    const barWidth = 400;
    const barHeight = 20;

    // Clear and redraw health bar
    this.bossHealthBar.clear();
    
    // Health bar color (green to red based on health)
    const healthPercent = health / maxHealth;
    const color = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000;
    
    this.bossHealthBar.fillStyle(color, 1);
    this.bossHealthBar.fillRect(
      centerX - 200,
      y,
      barWidth * healthPercent,
      barHeight
    );

    // Update text
    this.bossHealthText.setText(`Boss: ${health}/${maxHealth}`);
  }

  /**
   * Show/hide entire HUD
   */
  setVisible(visible: boolean): void {
    this.livesText.setVisible(visible);
    this.coinsText.setVisible(visible);
    this.timerText.setVisible(visible);
    
    if (this.bossHealthBar) {
      this.bossHealthBar.setVisible(visible);
      this.bossHealthBarBg.setVisible(visible);
      this.bossHealthText.setVisible(visible);
    }
  }

  /**
   * Destroy HUD
   */
  destroy(): void {
    this.livesText.destroy();
    this.coinsText.destroy();
    this.timerText.destroy();
    this.hideBossHealthBar();
    console.log('[HUDManager] Destroyed');
  }
}
