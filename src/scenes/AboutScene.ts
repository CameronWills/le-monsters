/**
 * About Scene
 * Shows game information and credits
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';

export class AboutScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.ABOUT });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    const title = this.add.text(centerX, 80, "About Labufu's Mission", {
      fontSize: '48px',
      color: '#ff6b6b',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Description
    const description = this.add.text(
      centerX,
      centerY - 50,
      `A browser-based 2D platformer adventure!

Guide Labufu the wizard through dangerous lands filled with monsters.
Collect coins, activate checkpoints, and defeat the boss!

Controls:
WASD or Arrow Keys - Move
Space/W/Up Arrow - Jump
Shift - Shoot (with wizard hat)
ESC - Pause

Designed and illustrated by Hugo W.

Built with Phaser 3 and TypeScript`,
      {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      }
    );
    description.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Back button
    this.createButton(centerX, this.cameras.main.height - 100, 'Back to Menu', () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });

    // ESC key to go back
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });

    console.log('[AboutScene] Created');
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
