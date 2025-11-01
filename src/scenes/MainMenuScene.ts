/**
 * Main Menu Scene
 * Initial scene with game title and menu options
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background color
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Game title
    const title = this.add.text(centerX, centerY - 150, 'LE MONSTERS', {
      fontSize: '84px',
      color: '#ff6b6b',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Subtitle
    const subtitle = this.add.text(centerX, centerY - 80, 'Browser Edition', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'italic',
      stroke: '#000000',
      strokeThickness: 4,
    });
    subtitle.setOrigin(0.5).setDepth(DEPTHS.UI);

    // New Game button
    this.createButton(centerX, centerY + 20, 'New Game', () => {
      this.scene.start(SCENE_KEYS.GAME);
    });

    // About button
    this.createButton(centerX, centerY + 100, 'About', () => {
      this.scene.start(SCENE_KEYS.ABOUT);
    });

    // Settings button (placeholder for future)
    this.createButton(centerX, centerY + 180, 'Settings', () => {
      console.log('[MainMenuScene] Settings clicked (not yet implemented)');
    });

    // Add bouncing animation to title
    this.tweens.add({
      targets: title,
      y: centerY - 160,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Version text
    const version = this.add.text(10, this.cameras.main.height - 30, 'v1.0.0-alpha', {
      fontSize: '16px',
      color: '#666666',
    });
    version.setDepth(DEPTHS.UI);

    console.log('[MainMenuScene] Created');
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
    const bg = this.add.rectangle(0, 0, 300, 60, 0x2a2a4e);
    bg.setStrokeStyle(3, 0xff6b6b);

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
        bg.setFillStyle(0x3a3a5e);
        container.setScale(1.05);
      })
      .on('pointerout', () => {
        bg.setFillStyle(0x2a2a4e);
        container.setScale(1);
      })
      .on('pointerdown', () => {
        bg.setFillStyle(0x4a4a6e);
      })
      .on('pointerup', () => {
        bg.setFillStyle(0x3a3a5e);
        callback();
      });

    return container;
  }
}
