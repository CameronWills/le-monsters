/**
 * Entity Type Interfaces
 * Contracts for all game entities (player, enemies, collectibles, platforms)
 */

import Phaser from 'phaser';

/**
 * Base contract for all game entities
 */
export interface IEntity {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type: string;
  isActive: boolean;
  update(delta: number): void;
  destroy(): void;
}

/**
 * Player entity interface
 */
export interface IPlayer extends IEntity {
  type: 'player';
  lives: number;
  hasWizardHat: boolean;
  isInvincible: boolean;
  facingDirection: 1 | -1;
  isGrounded: boolean;
  shootCooldown: number;

  move(direction: -1 | 0 | 1): void;
  jump(): void;
  stop(): void;
  shoot(): IPlayerProjectile | null;
  stompEnemy(enemy: IEnemy): void;
  takeDamage(): void;
  respawnAtCheckpoint(checkpoint: ICheckpoint): void;
  makeInvincible(duration: number): void;
  collectWizardHat(): void;
  removeWizardHat(): void;
  updateAnimation(): void;
}

/**
 * Base enemy interface
 */
export interface IEnemy extends IEntity {
  type: 'enemy-bird' | 'enemy-shark';
  isAlive: boolean;
  spawnPosition: { x: number; y: number };
  takeDamage(): void;
  die(): void;
  respawn(): void;
}

/**
 * Bird enemy interface
 */
export interface IEnemyBird extends IEnemy {
  type: 'enemy-bird';
  flyDirection: 1 | -1;
  flySpeed: number;
  droppingCooldown: number;
  dropProjectile(): IEnemyProjectile;
  checkBounds(): void;
}

/**
 * Shark enemy interface
 */
export interface IEnemyShark extends IEnemy {
  type: 'enemy-shark';
  patrolStart: number;
  patrolEnd: number;
  patrolSpeed: number;
  patrolDirection: 1 | -1;
  reverseDirection(): void;
  isAtBoundary(): boolean;
}

/**
 * Boss enemy interface
 */
export interface IBoss extends IEntity {
  type: 'boss';
  health: number;
  readonly maxHealth: number;
  isAlive: boolean;
  isVulnerable: boolean;
  attackPhase: 'burst' | 'pause';
  burstShotsFired: number;
  phaseCooldown: number;

  updateAttackPattern(delta: number): void;
  shootProjectile(): IBossProjectile;
  switchPhase(): void;
  takeDamage(amount: number): void;
  defeat(): void;
}

/**
 * Checkpoint interface
 */
export interface ICheckpoint extends IEntity {
  type: 'checkpoint';
  isActivated: boolean;
  flagSprite: Phaser.GameObjects.Sprite;
  activate(): void;
  getRespawnPosition(): { x: number; y: number };
}

/**
 * Wizard hat power-up interface
 */
export interface IPowerUpWizardHat extends IEntity {
  type: 'power-up-wizard-hat';
  isCollected: boolean;
  spawnPosition: { x: number; y: number };
  collect(player: IPlayer): void;
  respawn(): void;
}

/**
 * Coin interface
 */
export interface ICoin extends IEntity {
  type: 'coin';
  isCollected: boolean;
  collect(player: IPlayer): void;
}

/**
 * Platform interface
 */
export interface IPlatform extends IEntity {
  type: 'platform-static' | 'platform-moving';
  width: number;
  height: number;
  textureKey: string;
}

/**
 * Moving platform interface
 */
export interface IMovingPlatform extends IPlatform {
  type: 'platform-moving';
  path: Array<{ x: number; y: number }>;
  speed: number;
  currentWaypoint: number;
  pathIndicators: Phaser.GameObjects.Graphics[];
  moveAlongPath(delta: number): void;
  advanceWaypoint(): void;
  createPathIndicators(): void;
}

/**
 * Base projectile interface
 */
export interface IProjectile extends IEntity {
  type: 'projectile-player' | 'projectile-enemy' | 'projectile-boss';
  speed: number;
  direction: { x: number; y: number };
  shouldDestroy(): boolean;
}

/**
 * Player projectile interface
 */
export interface IPlayerProjectile extends IProjectile {
  type: 'projectile-player';
  traveledDistance: number;
  maxDistance: number;
}

/**
 * Enemy projectile interface
 */
export interface IEnemyProjectile extends IProjectile {
  type: 'projectile-enemy';
}

/**
 * Boss projectile interface
 */
export interface IBossProjectile extends IProjectile {
  type: 'projectile-boss';
  targetPosition: { x: number; y: number };
}

/**
 * Level data structure from JSON
 */
export interface ILevelData {
  metadata: ILevelMetadata;
  playerStart: { x: number; y: number };
  platforms: IPlatformData[];
  checkpoints: ICheckpointData[];
  enemies: IEnemyData[];
  coins: ICoinData[];
  powerUps: IPowerUpData[];
  bossArena: IBossArenaData;
}

export interface ILevelMetadata {
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
}

export interface IPlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'static' | 'moving';
  path?: Array<{ x: number; y: number }>;
  speed?: number;
}

export interface ICheckpointData {
  x: number;
  y: number;
}

export interface IEnemyData {
  type: 'bird' | 'shark';
  x: number;
  y: number;
  flyDirection?: -1 | 1;
  patrolStart?: number;
  patrolEnd?: number;
}

export interface ICoinData {
  x: number;
  y: number;
}

export interface IPowerUpData {
  type: 'wizard-hat';
  x: number;
  y: number;
}

export interface IBossArenaData {
  x: number;
  y: number;
  width: number;
  height: number;
  bossPosition: { x: number; y: number };
}

/**
 * Game session state
 */
export interface IGameSession {
  lives: number;
  coinsCollected: number;
  currentCheckpoint: ICheckpoint | null;
  gameStartTime: number;
  elapsedTime: number;
  bossDefeated: boolean;
}

/**
 * Session end data (for victory/game over screens)
 */
export interface ISessionEndData {
  finalTime: number;
  coinsCollected: number;
}

/**
 * Save data structure (LocalStorage)
 */
export interface ISaveData {
  bestTime: number | null;
  totalCoinsCollected: number;
  audioSettings: IAudioSettings;
}

/**
 * Audio settings
 */
export interface IAudioSettings {
  musicVolume: number;
  sfxVolume: number;
  musicMuted: boolean;
  sfxMuted: boolean;
}
