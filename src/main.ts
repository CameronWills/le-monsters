/**
 * Game Entry Point
 * Initializes the Phaser game instance
 */

import Phaser from 'phaser';
import { phaserConfig } from './config/phaser-config';

// Create Phaser game instance
const game = new Phaser.Game(phaserConfig);

// Expose game instance for debugging in development mode
if (import.meta.env.DEV) {
  (window as any).game = game;
  console.log('Le Monsters - Game initialized');
  console.log('Access game instance via: window.game');
}

// Handle window resize for responsive scaling
window.addEventListener('resize', () => {
  game.scale.refresh();
});

export default game;
