/**
 * Input Manager
 * Centralized keyboard input handling with buffering
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';

export class InputManager {
  private scene!: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  
  private jumpBuffer = 0; // Frames to buffer jump input
  private enabled = true;

  /**
   * Initialize input manager
   */
  init(scene: Phaser.Scene): void {
    this.scene = scene;

    // Setup keyboard inputs
    this.cursors = scene.input.keyboard!.createCursorKeys();
    
    // WASD keys
    this.wasd = {
      up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      down: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Shift for shooting
    this.shiftKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    // ESC for pause
    this.escKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    console.log('[InputManager] Initialized');
  }

  /**
   * Update input state (called every frame)
   */
  update(delta: number): void {
    if (!this.enabled) {
      return;
    }

    // Update jump buffer
    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= delta;
    }

    // Buffer jump input
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space!) ||
        Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
      this.jumpBuffer = GAME_CONFIG.JUMP_BUFFER_FRAMES * (1000 / GAME_CONFIG.TARGET_FPS);
    }
  }

  /**
   * Get current movement input
   */
  getMovementX(): -1 | 0 | 1 {
    if (!this.enabled) {
      return 0;
    }

    const left = this.cursors.left?.isDown || this.wasd.left.isDown;
    const right = this.cursors.right?.isDown || this.wasd.right.isDown;

    if (left && !right) {
      return -1;
    } else if (right && !left) {
      return 1;
    }
    return 0;
  }

  /**
   * Check if jump was pressed (with buffering)
   */
  isJumpPressed(): boolean {
    if (!this.enabled) {
      return false;
    }

    return this.jumpBuffer > 0;
  }

  /**
   * Consume jump input (called after successful jump)
   */
  consumeJump(): void {
    this.jumpBuffer = 0;
  }

  /**
   * Check if shoot was pressed
   */
  isShootPressed(): boolean {
    if (!this.enabled) {
      return false;
    }

    return Phaser.Input.Keyboard.JustDown(this.shiftKey);
  }

  /**
   * Check if pause was pressed
   */
  isPausePressed(): boolean {
    if (!this.enabled) {
      return false;
    }

    return Phaser.Input.Keyboard.JustDown(this.escKey);
  }

  /**
   * Enable/disable input processing
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`[InputManager] ${enabled ? 'Enabled' : 'Disabled'}`);
  }

  /**
   * Clear input buffer
   */
  clearBuffer(): void {
    this.jumpBuffer = 0;
  }
}
