/**
 * Phaser Game Configuration
 * Main configuration for the Phaser game instance
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from './constants';

// Import scenes
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { GameScene } from '../scenes/GameScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { AboutScene } from '../scenes/AboutScene';
import { PauseScene } from '../scenes/PauseScene';
import { VictoryScene } from '../scenes/VictoryScene';
import { GameOverScene } from '../scenes/GameOverScene';

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: GAME_CONFIG.CANVAS_WIDTH,
  height: GAME_CONFIG.CANVAS_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#87CEEB', // Sky blue
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.GRAVITY },
      debug: false, // Set to true to see collision boxes during development
    },
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    AboutScene,
    GameScene,
    PauseScene,
    VictoryScene,
    GameOverScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT, // Scale to fit parent while maintaining aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas
  },
  fps: {
    target: GAME_CONFIG.TARGET_FPS,
    forceSetTimeOut: false, // Use requestAnimationFrame for better performance
  },
  render: {
    pixelArt: true, // Crisp pixel art rendering (no smoothing)
    antialias: false,
    roundPixels: true, // Prevent sub-pixel rendering
  },
};
