/**
 * Pause Scene
 * Overlay scene shown when player presses ESC
 */

import Phaser from 'phaser';
import { SCENE_KEYS, DEPTHS } from '../config/constants';

export class PauseScene extends Phaser.Scene {
  private gameSceneKey!: string;

  constructor() {
    super({ key: SCENE_KEYS.PAUSE });
  }

  init(data: { gameSceneKey: string }): void {
    this.gameSceneKey = data.gameSceneKey || SCENE_KEYS.GAME;
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Semi-transparent dark overlay
    const overlay = this.add.rectangle(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );
    overlay.setOrigin(0, 0).setDepth(DEPTHS.UI);

    // Pause title
    const title = this.add.text(centerX, centerY - 120, 'PAUSED', {
      fontSize: '64px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });
    title.setOrigin(0.5).setDepth(DEPTHS.UI);

    // Resume button
    this.createButton(centerX, centerY, 'Resume', () => {
      this.resumeGame();
    });

    // Restart button
    this.createButton(centerX, centerY + 80, 'Restart', () => {
      this.scene.stop(SCENE_KEYS.PAUSE);
      this.scene.stop(this.gameSceneKey);
      this.scene.start(SCENE_KEYS.GAME);
    });

    // Main Menu button
    this.createButton(centerX, centerY + 160, 'Main Menu', () => {
      this.scene.stop(SCENE_KEYS.PAUSE);
      this.scene.stop(this.gameSceneKey);
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });

    // ESC key to resume
    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame();
    });

    console.log('[PauseScene] Created');
  }

  /**
   * Resume the game
   */
  private resumeGame(): void {
    this.scene.resume(this.gameSceneKey);
    this.scene.stop(SCENE_KEYS.PAUSE);
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
