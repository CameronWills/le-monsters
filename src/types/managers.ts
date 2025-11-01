/**
 * Manager Service Interfaces
 * Contracts for game management services
 */

import Phaser from 'phaser';
import type {
  IPlayer,
  IEnemy,
  IEnemyBird,
  IEnemyShark,
  IBoss,
  ICheckpoint,
  ICoin,
  IPowerUpWizardHat,
  IPlayerProjectile,
  IEnemyProjectile,
  IBossProjectile,
  IGameSession,
  ISessionEndData,
  ISaveData,
  IAudioSettings,
  ILevelData,
  ILevelMetadata,
} from './entities';

/**
 * Input manager interface
 */
export interface IInputManager {
  init(scene: Phaser.Scene): void;
  update(delta: number): void;
  getMovementX(): -1 | 0 | 1;
  isJumpPressed(): boolean;
  isShootPressed(): boolean;
  isPausePressed(): boolean;
  setEnabled(enabled: boolean): void;
  clearBuffer(): void;
}

/**
 * Audio manager interface
 */
export interface IAudioManager {
  init(scene: Phaser.Scene): void;
  playMusic(key: string, fadeIn?: boolean): void;
  stopMusic(fadeOut?: boolean): void;
  pauseMusic(): void;
  resumeMusic(): void;
  setMusicVolume(volume: number): void;
  toggleMusicMute(): void;
  playSFX(key: string, volume?: number): void;
  setSFXVolume(volume: number): void;
  toggleSFXMute(): void;
  preloadAudio(scene: Phaser.Scene): void;
  loadSettings(settings: IAudioSettings): void;
  getSettings(): IAudioSettings;
}

/**
 * Game state manager interface
 */
export interface IGameStateManager {
  startNewSession(): IGameSession;
  getCurrentSession(): IGameSession | null;
  updateTimer(delta: number): void;
  getElapsedTime(): number;
  getFormattedTime(): string;
  collectCoin(): void;
  getCoinCount(): number;
  loseLife(): number;
  getLives(): number;
  setCheckpoint(checkpoint: ICheckpoint): void;
  getCurrentCheckpoint(): ICheckpoint | null;
  defeatBoss(): void;
  isBossDefeated(): boolean;
  endSession(): ISessionEndData;
}

/**
 * Save data manager interface
 */
export interface ISaveDataManager {
  load(): ISaveData;
  save(data: ISaveData): void;
  updateBestTime(time: number): boolean;
  getBestTime(): number | null;
  getFormattedBestTime(): string;
  addTotalCoins(amount: number): void;
  getTotalCoins(): number;
  updateAudioSettings(settings: IAudioSettings): void;
  getAudioSettings(): IAudioSettings;
  clearAll(): void;
}

/**
 * Level data manager interface
 */
export interface ILevelDataManager {
  loadLevel(scene: Phaser.Scene, levelKey: string): void;
  parseLevel(levelKey: string): ILevelData;
  getLevelMetadata(levelKey: string): ILevelMetadata;
}

/**
 * HUD manager interface
 */
export interface IHUDManager {
  init(scene: Phaser.Scene): void;
  updateLives(lives: number): void;
  updateCoins(coins: number): void;
  updateTimer(time: number): void;
  showBossHealthBar(): void;
  hideBossHealthBar(): void;
  updateBossHealth(health: number, maxHealth: number): void;
  setVisible(visible: boolean): void;
  destroy(): void;
}

/**
 * Collision manager interface
 */
export interface ICollisionManager {
  init(scene: Phaser.Scene): void;
  setupPlayerCollisions(
    player: IPlayer,
    platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group,
    collectibles: Phaser.Physics.Arcade.Group,
    checkpoints: Phaser.Physics.Arcade.Group
  ): void;
  setupProjectileCollisions(
    playerProjectiles: Phaser.Physics.Arcade.Group,
    enemyProjectiles: Phaser.Physics.Arcade.Group,
    bossProjectiles: Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group,
    boss: IBoss | null,
    platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group
  ): void;
  setupEnemyCollisions(
    enemies: Phaser.Physics.Arcade.Group,
    platforms: Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group
  ): void;
  disableAll(): void;
  enableAll(): void;
}

/**
 * Animation manager interface
 */
export interface IAnimationManager {
  registerAllAnimations(scene: Phaser.Scene): void;
  registerPlayerAnimations(scene: Phaser.Scene): void;
  registerEnemyAnimations(scene: Phaser.Scene): void;
  registerBossAnimations(scene: Phaser.Scene): void;
  registerCollectibleAnimations(scene: Phaser.Scene): void;
  registerUIAnimations(scene: Phaser.Scene): void;
}

/**
 * Camera manager interface
 */
export interface ICameraManager {
  init(scene: Phaser.Scene): void;
  followPlayer(player: IPlayer): void;
  setBounds(width: number, height: number): void;
  shake(intensity: number, duration: number): void;
  flash(color: number, duration: number): void;
  fadeOut(duration: number, onComplete: () => void): void;
  fadeIn(duration: number): void;
  panTo(x: number, y: number, duration: number): void;
  stopFollow(): void;
}

/**
 * Entity factory interface
 */
export interface IEntityFactory {
  createPlayer(x: number, y: number): IPlayer;
  createBird(x: number, y: number, flyDirection: 1 | -1): IEnemyBird;
  createShark(
    x: number,
    y: number,
    patrolStart: number,
    patrolEnd: number
  ): IEnemyShark;
  createBoss(x: number, y: number): IBoss;
  createCheckpoint(x: number, y: number): ICheckpoint;
  createWizardHat(x: number, y: number): IPowerUpWizardHat;
  createCoin(x: number, y: number): ICoin;
  createStaticPlatform(
    x: number,
    y: number,
    width: number,
    height: number
  ): any; // IPlatform
  createMovingPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    path: Array<{ x: number; y: number }>,
    speed: number
  ): any; // IMovingPlatform
  createPlayerProjectile(
    x: number,
    y: number,
    direction: 1 | -1
  ): IPlayerProjectile;
  createEnemyProjectile(x: number, y: number): IEnemyProjectile;
  createBossProjectile(
    x: number,
    y: number,
    targetX: number,
    targetY: number
  ): IBossProjectile;
  recycleProjectile(projectile: any): void; // IProjectile
}
