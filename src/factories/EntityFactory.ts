/**
 * Entity Factory
 * Centralized entity creation and object pooling
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { MovingPlatform } from '../entities/MovingPlatform';
import { Coin } from '../entities/Coin';
import { Checkpoint } from '../entities/Checkpoint';
import { EnemyBird } from '../entities/EnemyBird';
import { EnemyShark } from '../entities/EnemyShark';
import { EnemyFrog } from '../entities/EnemyFrog';
import { EnemyProjectile } from '../entities/EnemyProjectile';
import { PowerUpWizardHat } from '../entities/PowerUpWizardHat';
import { PlayerProjectile } from '../entities/PlayerProjectile';
import { Boss } from '../entities/Boss';
import { BossProjectile } from '../entities/BossProjectile';
import type {
  IPlayer,
  IEnemyBird,
  IEnemyShark,
  IEnemyFrog,
  IBoss,
  ICheckpoint,
  IPowerUpWizardHat,
  ICoin,
  IPlayerProjectile,
  IEnemyProjectile,
  IBossProjectile,
  IPlatform,
  IMovingPlatform,
} from '../types/entities';

export class EntityFactory {
  private scene: Phaser.Scene;

  // Object pools (for projectiles)
  private playerProjectilePool: IPlayerProjectile[] = [];
  private enemyProjectilePool: IEnemyProjectile[] = [];
  private bossProjectilePool: IBossProjectile[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializePools();
  }

  /**
   * Initialize object pools for projectiles
   */
  private initializePools(): void {
    console.log('[EntityFactory] Initializing object pools...');

    // TODO: Pre-create projectiles in pools when implementing combat (US2/US3)
    // For now, pools are empty and will grow dynamically
  }

  /**
   * Create player entity
   */
  createPlayer(x: number, y: number): IPlayer {
    return new Player(this.scene, x, y);
  }

  /**
   * Create bird enemy
   */
  createBird(
    x: number,
    y: number,
    flyDirection: 1 | -1,
    onDropProjectile?: (projectile: IEnemyProjectile) => void
  ): IEnemyBird {
    const worldWidth = this.scene.physics.world.bounds.width;
    return new EnemyBird(this.scene, x, y, flyDirection, worldWidth, onDropProjectile);
  }

  /**
   * Create shark enemy
   */
  createShark(
    x: number,
    y: number,
    patrolStart: number,
    patrolEnd: number
  ): IEnemyShark {
    return new EnemyShark(this.scene, x, y, patrolStart, patrolEnd);
  }

  /**
   * Create frog enemy
   */
  createFrog(
    x: number,
    y: number,
    playerRef: Phaser.Physics.Arcade.Sprite,
    platforms: Phaser.GameObjects.Group
  ): IEnemyFrog {
    return new EnemyFrog(this.scene, x, y, playerRef, platforms);
  }

  /**
   * Create boss entity
   */
  createBoss(
    x: number,
    y: number,
    playerRef: Phaser.Physics.Arcade.Sprite,
    onShootProjectile?: (projectile: IBossProjectile) => void
  ): IBoss {
    return new Boss(this.scene, x, y, playerRef, onShootProjectile);
  }

  /**
   * Create checkpoint
   */
  createCheckpoint(x: number, y: number): ICheckpoint {
    return new Checkpoint(this.scene, x, y);
  }

  /**
   * Create wizard hat power-up
   */
  createWizardHat(x: number, y: number): IPowerUpWizardHat {
    return new PowerUpWizardHat(this.scene, x, y);
  }

  /**
   * Create coin collectible
   */
  createCoin(x: number, y: number): ICoin {
    return new Coin(this.scene, x, y);
  }

  /**
   * Create static platform
   */
  createStaticPlatform(
    x: number,
    y: number,
    width: number,
    height: number
  ): IPlatform {
    return new Platform(this.scene, x, y, width, height);
  }

  /**
   * Create moving platform
   */
  createMovingPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    path: Array<{ x: number; y: number }>,
    speed: number
  ): IMovingPlatform {
    return new MovingPlatform(this.scene, x, y, width, height, path, speed);
  }

  /**
   * Create player projectile (with pooling)
   */
  createPlayerProjectile(
    x: number,
    y: number,
    direction: 1 | -1
  ): IPlayerProjectile {
    return new PlayerProjectile(this.scene, x, y, direction);
  }

  /**
   * Create enemy projectile (with pooling)
   */
  createEnemyProjectile(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number
  ): IEnemyProjectile {
    return new EnemyProjectile(this.scene, x, y, velocityX, velocityY);
  }

  /**
   * Create boss projectile (with pooling)
   * TODO: Implement in US3 tasks
   */
  createBossProjectile(
    x: number,
    y: number,
    targetX: number,
    targetY: number
  ): IBossProjectile {
    const pooled = this.bossProjectilePool.find((p) => !p.isActive);
    if (pooled) {
      // Reuse from pool
      // pooled.reset(x, y, targetX, targetY);
      // return pooled;
    }

    // Create new boss projectile
    const bossProjectile = new BossProjectile(this.scene, x, y, targetX, targetY);
    this.bossProjectilePool.push(bossProjectile);
    return bossProjectile;
  }

  /**
   * Return projectile to pool (instead of destroying)
   */
  recycleProjectile(projectile: any): void {
    // Mark as inactive for reuse
    if (projectile && projectile.isActive !== undefined) {
      projectile.isActive = false;
    }
  }
}
