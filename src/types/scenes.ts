/**
 * Scene Type Interfaces
 * Contracts for Phaser scene lifecycle and behavior
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
  IPlatformData,
  IEnemyData,
  ICoinData,
  IPowerUpData,
  ICheckpointData,
} from './entities';

/**
 * Base scene interface
 */
export interface IGameScene {
  readonly sceneKey: string;
  init(data?: Record<string, unknown>): void;
  preload(): void;
  create(): void;
  update(time: number, delta: number): void;
  shutdown(): void;
}

/**
 * Boot scene interface
 */
export interface IBootScene extends IGameScene {
  sceneKey: 'BootScene';
  configureGame(): void;
  loadBootAssets(): void;
  startPreloader(): void;
}

/**
 * Preload scene interface
 */
export interface IPreloadScene extends IGameScene {
  sceneKey: 'PreloadScene';
  createLoadingUI(): void;
  loadGameAssets(): void;
  createAnimations(): void;
  updateProgressBar(progress: number): void;
  startMainMenu(): void;
}

/**
 * Main menu scene interface
 */
export interface IMainMenuScene extends IGameScene {
  sceneKey: 'MainMenuScene';
  createMenuUI(): void;
  loadSaveData(): void;
  startNewGame(): void;
  showAbout(): void;
  setupButtonInteractions(): void;
}

/**
 * About scene interface
 */
export interface IAboutScene extends IGameScene {
  sceneKey: 'AboutScene';
  createAboutUI(): void;
  returnToMenu(): void;
}

/**
 * Game scene interface
 */
export interface IGameSceneInterface extends IGameScene {
  sceneKey: 'GameScene';

  // Initialization
  loadLevel(levelKey: string): void;
  createPlayer(startPosition: { x: number; y: number }): void;
  createPlatforms(platformData: IPlatformData[]): void;
  createEnemies(enemyData: IEnemyData[]): void;
  createCollectibles(coinData: ICoinData[], powerUpData: IPowerUpData[]): void;
  createCheckpoints(checkpointData: ICheckpointData[]): void;
  setupCollisionHandlers(): void;
  createHUD(): void;
  startGameSession(): void;

  // Update loop
  updatePlayer(delta: number): void;
  updateEnemies(delta: number): void;
  updateBoss(delta: number): void;
  updateProjectiles(delta: number): void;
  updateMovingPlatforms(delta: number): void;
  updateGameState(delta: number): void;
  checkBossArenaEntry(): void;

  // Collision handlers
  handlePlayerEnemyCollision(
    player: IPlayer,
    enemy: IEnemyBird | IEnemyShark
  ): void;
  handlePlayerCoinCollision(player: IPlayer, coin: ICoin): void;
  handlePlayerPowerUpCollision(
    player: IPlayer,
    powerUp: IPowerUpWizardHat
  ): void;
  handlePlayerCheckpointCollision(
    player: IPlayer,
    checkpoint: ICheckpoint
  ): void;
  handleProjectileEnemyCollision(
    projectile: IPlayerProjectile,
    enemy: IEnemyBird | IEnemyShark
  ): void;
  handleProjectileBossCollision(
    projectile: IPlayerProjectile,
    boss: IBoss
  ): void;
  handleEnemyProjectilePlayerCollision(
    projectile: IEnemyProjectile | IBossProjectile,
    player: IPlayer
  ): void;
  handlePlayerOutOfBounds(player: IPlayer): void;

  // Game state management
  triggerPlayerDeath(): void;
  respawnPlayer(): void;
  startBossBattle(): void;
  defeatBoss(): void;
  triggerGameOver(): void;
  pauseGame(): void;
  resumeGame(): void;
}

/**
 * Pause scene interface
 */
export interface IPauseScene extends IGameScene {
  sceneKey: 'PauseScene';
  createPauseUI(): void;
  continueGame(): void;
  confirmQuitToMenu(): void;
  quitToMenu(): void;
}

/**
 * Victory scene interface
 */
export interface IVictoryScene extends IGameScene {
  sceneKey: 'VictoryScene';
  init(data: { finalTime: number; coinsCollected: number }): void;
  createVictoryUI(finalTime: number, coinsCollected: number): void;
  checkAndSaveBestTime(finalTime: number): boolean;
  returnToMenu(): void;
}

/**
 * Game over scene interface
 */
export interface IGameOverScene extends IGameScene {
  sceneKey: 'GameOverScene';
  init(data: { finalTime: number; coinsCollected: number }): void;
  createGameOverUI(finalTime: number, coinsCollected: number): void;
  tryAgain(): void;
  returnToMenu(): void;
}

/**
 * Scene transition data types
 */
export interface INewGameSessionData {
  levelKey: string;
}

export interface IVictorySceneData {
  finalTime: number;
  coinsCollected: number;
}

export interface IGameOverSceneData {
  finalTime: number;
  coinsCollected: number;
}
