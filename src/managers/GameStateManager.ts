/**
 * Game State Manager
 * Global game state and session management
 */

import { GAME_CONFIG } from '../config/constants';
import type { IGameSession, ISessionEndData, ICheckpoint } from '../types/entities';

export class GameStateManager {
  private currentSession: IGameSession | null = null;
  
  // NEW: Enemy and item respawn tracking
  private defeatedEnemies: Set<string> = new Set();
  private collectedItems: Set<string> = new Set();

  /**
   * Start new game session
   */
  startNewSession(): IGameSession {
    this.currentSession = {
      lives: GAME_CONFIG.PLAYER_MAX_LIVES,
      coinsCollected: 0,
      currentCheckpoint: null,
      gameStartTime: Date.now(),
      elapsedTime: 0,
      bossDefeated: false,
    };

    console.log('[GameStateManager] New session started');
    return this.currentSession;
  }

  /**
   * Get current game session
   */
  getCurrentSession(): IGameSession | null {
    return this.currentSession;
  }

  /**
   * Update game timer
   */
  updateTimer(delta: number): void {
    if (this.currentSession) {
      this.currentSession.elapsedTime += delta;
    }
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    return this.currentSession?.elapsedTime ?? 0;
  }

  /**
   * Get elapsed time formatted as MM:SS
   */
  getFormattedTime(): string {
    const totalSeconds = Math.floor(this.getElapsedTime() / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Increase coin count
   */
  collectCoin(): void {
    if (this.currentSession) {
      this.currentSession.coinsCollected++;
      console.log('[GameStateManager] Coins:', this.currentSession.coinsCollected);
    }
  }

  /**
   * Get total coins collected
   */
  getCoinCount(): number {
    return this.currentSession?.coinsCollected ?? 0;
  }

  /**
   * Decrease player lives
   */
  loseLife(): number {
    if (this.currentSession) {
      this.currentSession.lives--;
      console.log('[GameStateManager] Lives remaining:', this.currentSession.lives);
      return this.currentSession.lives;
    }
    return 0;
  }

  /**
   * Get current lives
   */
  getLives(): number {
    return this.currentSession?.lives ?? 0;
  }

  /**
   * Set current checkpoint
   */
  setCheckpoint(position: { x: number; y: number }): void {
    if (this.currentSession) {
      this.currentSession.currentCheckpoint = position as unknown as ICheckpoint;
      console.log('[GameStateManager] Checkpoint set');
    }
  }

  /**
   * Get current checkpoint for respawn
   */
  getCurrentCheckpoint(): { x: number; y: number } | null {
    const cp = this.currentSession?.currentCheckpoint;
    if (cp) {
      // Cast to access x, y properties
      return {
        x: (cp as unknown as { x: number; y: number }).x,
        y: (cp as unknown as { x: number; y: number }).y,
      };
    }
    return null;
  }

  /**
   * Mark boss as defeated
   */
  defeatBoss(): void {
    if (this.currentSession) {
      this.currentSession.bossDefeated = true;
      console.log('[GameStateManager] Boss defeated!');
    }
  }

  /**
   * Check if boss is defeated
   */
  isBossDefeated(): boolean {
    return this.currentSession?.bossDefeated ?? false;
  }

  /**
   * End current session
   */
  endSession(): ISessionEndData {
    const data: ISessionEndData = {
      finalTime: this.getElapsedTime(),
      coinsCollected: this.getCoinCount(),
    };

    console.log('[GameStateManager] Session ended', data);
    return data;
  }

  // ==========================================
  // NEW: Enemy Respawn Tracking (T022)
  // ==========================================

  /**
   * Add defeated enemy ID to tracking set
   * Called when any enemy is defeated
   */
  addDefeatedEnemy(id: string): void {
    this.defeatedEnemies.add(id);
    console.log(`[GameStateManager] Enemy defeated: ${id} (total: ${this.defeatedEnemies.size})`);
  }

  /**
   * Check if enemy has been defeated
   * Returns true if enemy should NOT spawn
   */
  isEnemyDefeated(id: string): boolean {
    return this.defeatedEnemies.has(id);
  }

  /**
   * Clear all defeated enemies
   * Called when player dies and respawns at checkpoint
   */
  clearDefeatedEnemies(): void {
    const count = this.defeatedEnemies.size;
    this.defeatedEnemies.clear();
    console.log(`[GameStateManager] Cleared ${count} defeated enemies (respawning all)`);
  }

  // ==========================================
  // NEW: Item Collection Tracking (T023)
  // ==========================================

  /**
   * Add collected item ID to tracking set
   * Called when coin or wizard hat is collected
   */
  addCollectedItem(id: string): void {
    this.collectedItems.add(id);
    console.log(`[GameStateManager] Item collected: ${id} (total: ${this.collectedItems.size})`);
  }

  /**
   * Check if item has been collected
   * Returns true if item should NOT spawn
   */
  isItemCollected(id: string): boolean {
    return this.collectedItems.has(id);
  }

  /**
   * Clear all collected items
   * Called when player dies and respawns at checkpoint
   */
  clearCollectedItems(): void {
    const count = this.collectedItems.size;
    this.collectedItems.clear();
    console.log(`[GameStateManager] Cleared ${count} collected items (respawning all)`);
  }
}
