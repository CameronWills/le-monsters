/**
 * Main Menu Scene
 * Initial scene with game title and menu options
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';

export class MainMenuScene extends Phaser.Scene {
  private menuMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Set white background color
    this.cameras.main.setBackgroundColor('#ffffff');

    // Play menu music at 30% volume, no repeat
    this.menuMusic = this.sound.add('menu-music', {
      volume: 0.2,
      loop: false
    });
    this.menuMusic.play();

    // Background image
    const background = this.add.image(centerX, centerY, 'menu-background');
    background.setDisplaySize(1255, this.cameras.main.height);
    background.setDepth(0); // Behind everything

    // Add dark overlay for better text readability
    const overlay = this.add.rectangle(
      centerX,
      centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0 // 40% opacity
    );
    overlay.setDepth(1);

    // Game title
    const title = this.add.text(centerX, centerY - 150, "LABUFU'S\nMISSION", {
      fontSize: '84px',
      color: '#333',
      fontStyle: 'bold',
      stroke: '#FFF',
      strokeThickness: 8,
      align: 'center',
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // New Game button
    this.createButton(centerX, centerY + 170, 'New Game', () => {
      // Stop menu music when starting game
      if (this.menuMusic) {
        this.menuMusic.stop();
      }
      this.scene.start(SCENE_KEYS.GAME);
    });

    // About button
    this.createButton(centerX, centerY + 250, 'About', () => {
      // Stop menu music when going to about screen
      if (this.menuMusic) {
        this.menuMusic.stop();
      }
      this.scene.start(SCENE_KEYS.ABOUT);
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
      color: '#333',
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
