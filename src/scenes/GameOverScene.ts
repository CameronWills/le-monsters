/**
 * Game Over Scene
 * Displayed when player runs out of lives
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';
import type { ISessionEndData } from '../types/entities';

export class GameOverScene extends Phaser.Scene {
  private sessionData!: ISessionEndData;

  constructor() {
    super({ key: SCENE_KEYS.GAME_OVER });
  }

  init(data: ISessionEndData): void {
    this.sessionData = data;
    console.log('[GameOverScene] Session data:', this.sessionData);
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Fade in from black
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Dark overlay background
    const overlay = this.add.rectangle(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.8
    );
    overlay.setOrigin(0, 0).setDepth(DEPTHS.UI);

    // Game Over title
    const title = this.add.text(centerX, centerY - 150, 'GAME OVER', {
      fontSize: '72px',
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Stats display
    const statsY = centerY - 50;
    
    // Format time
    const totalSeconds = Math.floor(this.sessionData.finalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const statsText = this.add.text(
      centerX,
      statsY,
      `Time Survived: ${timeStr}\nCoins Collected: ${this.sessionData.coinsCollected}`,
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      }
    );
    statsText.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Try Again button
    const tryAgainButton = this.createButton(
      centerX,
      centerY + 80,
      'Try Again',
      () => {
        this.scene.start(SCENE_KEYS.GAME);
      }
    );

    // Main Menu button
    const mainMenuButton = this.createButton(
      centerX,
      centerY + 160,
      'Main Menu',
      () => {
        this.scene.start(SCENE_KEYS.MAIN_MENU);
      }
    );

    // Add flashing effect to title
    this.tweens.add({
      targets: title,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    console.log('[GameOverScene] Created');
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
    const bg = this.add.rectangle(0, 0, 300, 60, 0x333333);
    bg.setStrokeStyle(3, 0xffffff);

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
        bg.setFillStyle(0x666666);
        container.setScale(1.05);
      })
      .on('pointerout', () => {
        bg.setFillStyle(0x333333);
        container.setScale(1);
      })
      .on('pointerdown', () => {
        bg.setFillStyle(0x999999);
      })
      .on('pointerup', () => {
        bg.setFillStyle(0x666666);
        callback();
      });

    return container;
  }
}
