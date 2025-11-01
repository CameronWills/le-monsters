/**
 * Entity Factory
 * Centralized entity creation and object pooling
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { Coin } from '../entities/Coin';
import { Checkpoint } from '../entities/Checkpoint';
import type {
  IPlayer,
  IEnemyBird,
  IEnemyShark,
  IBoss,
  ICheckpoint,
  IPowerUpWizardHat,
  ICoin,
  IPlayerProjectile,
  IEnemyProjectile,
  IBossProjectile,
  IPlatform,
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
   * TODO: Implement in US2 tasks
   */
  createBird(_x: number, _y: number, _flyDirection: 1 | -1): IEnemyBird {
    throw new Error('EntityFactory.createBird not yet implemented');
  }

  /**
   * Create shark enemy
   * TODO: Implement in US2 tasks
   */
  createShark(
    _x: number,
    _y: number,
    _patrolStart: number,
    _patrolEnd: number
  ): IEnemyShark {
    throw new Error('EntityFactory.createShark not yet implemented');
  }

  /**
   * Create boss entity
   * TODO: Implement in US3 tasks
   */
  createBoss(_x: number, _y: number): IBoss {
    throw new Error('EntityFactory.createBoss not yet implemented');
  }

  /**
   * Create checkpoint
   */
  createCheckpoint(x: number, y: number): ICheckpoint {
    return new Checkpoint(this.scene, x, y);
  }

  /**
   * Create wizard hat power-up
   * TODO: Implement in US2 tasks
   */
  createWizardHat(_x: number, _y: number): IPowerUpWizardHat {
    throw new Error('EntityFactory.createWizardHat not yet implemented');
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
   * TODO: Implement in Phase 8 (Moving Platforms)
   */
  createMovingPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    path: Array<{ x: number; y: number }>,
    speed: number
  ): any {
    throw new Error('EntityFactory.createMovingPlatform not yet implemented');
  }

  /**
   * Create player projectile (with pooling)
   * TODO: Implement in US2 tasks
   */
  createPlayerProjectile(
    x: number,
    y: number,
    direction: 1 | -1
  ): IPlayerProjectile {
    // Check pool for inactive projectile
    const pooled = this.playerProjectilePool.find((p) => !p.isActive);
    if (pooled) {
      // Reuse from pool
      // pooled.reset(x, y, direction);
      // return pooled;
    }

    // Pool empty, create new (will be added to pool later)
    throw new Error(
      'EntityFactory.createPlayerProjectile not yet implemented'
    );
  }

  /**
   * Create enemy projectile (with pooling)
   * TODO: Implement in US2 tasks
   */
  createEnemyProjectile(x: number, y: number): IEnemyProjectile {
    const pooled = this.enemyProjectilePool.find((p) => !p.isActive);
    if (pooled) {
      // Reuse from pool
      // pooled.reset(x, y);
      // return pooled;
    }

    throw new Error('EntityFactory.createEnemyProjectile not yet implemented');
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

    throw new Error('EntityFactory.createBossProjectile not yet implemented');
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
