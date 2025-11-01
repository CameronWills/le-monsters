/**
 * Victory Scene
 * Displayed when player completes the game
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';
import type { ISessionEndData } from '../types/entities';

export class VictoryScene extends Phaser.Scene {
  private sessionData!: ISessionEndData;

  constructor() {
    super({ key: SCENE_KEYS.VICTORY });
  }

  init(data: ISessionEndData): void {
    this.sessionData = data;
    console.log('[VictoryScene] Session data:', this.sessionData);
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background with celebratory color
    const overlay = this.add.rectangle(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x1a1a2e,
      1
    );
    overlay.setOrigin(0, 0).setDepth(DEPTHS.UI);

    // Victory title
    const title = this.add.text(centerX, centerY - 150, 'VICTORY!', {
      fontSize: '84px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Subtitle
    const subtitle = this.add.text(centerX, centerY - 80, 'You defeated the monsters!', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'italic',
      stroke: '#000000',
      strokeThickness: 4,
    });
    subtitle.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Stats display
    const statsY = centerY - 10;
    
    // Format time
    const totalSeconds = Math.floor(this.sessionData.finalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const statsText = this.add.text(
      centerX,
      statsY,
      `Completion Time: ${timeStr}\nCoins Collected: ${this.sessionData.coinsCollected}`,
      {
        fontSize: '32px',
        color: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      }
    );
    statsText.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Play Again button
    this.createButton(centerX, centerY + 100, 'Play Again', () => {
      this.scene.start(SCENE_KEYS.GAME);
    });

    // Main Menu button
    this.createButton(centerX, centerY + 180, 'Main Menu', () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });

    // Add pulsing animation to title
    this.tweens.add({
      targets: title,
      scale: 1.1,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Create some particle effects
    this.createCelebrationParticles(centerX, centerY - 150);

    console.log('[VictoryScene] Created');
  }

  /**
   * Create celebration particles
   */
  private createCelebrationParticles(x: number, y: number): void {
    // Create simple particle effect with graphics
    const colors = [0xffff00, 0x00ff00, 0xff6b6b, 0x4ecdc4];
    
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const particle = this.add.circle(x, y, 8, colors[i % colors.length]);
      particle.setDepth(DEPTHS.UI - 1);

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 200,
        y: y + Math.sin(angle) * 200,
        alpha: 0,
        duration: 2000,
        ease: 'Cubic.easeOut',
        repeat: -1,
        delay: i * 100,
      });
    }
  }

  /**
   * Create interactive button
   */
  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Button background
    const bg = this.add.rectangle(0, 0, 300, 60, 0x2a4e2a);
    bg.setStrokeStyle(3, 0x00ff00);

    // Button text
    const label = this.add.text(0, 0, text, {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    label.setOrigin(0.5);

    container.add([bg, label]);
    container.setDepth(DEPTHS.UI);

    // Make interactive
    bg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.setFillStyle(0x3a6e3a);
        container.setScale(1.05);
      })
      .on('pointerout', () => {
        bg.setFillStyle(0x2a4e2a);
        container.setScale(1);
      })
      .on('pointerdown', () => {
        bg.setFillStyle(0x4a8e4a);
      })
      .on('pointerup', () => {
        bg.setFillStyle(0x3a6e3a);
        callback();
      });

    return container;
  }
}
