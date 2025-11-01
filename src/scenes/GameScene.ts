/**
 * Game Scene
 * Main gameplay scene - core game loop
 */

import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/constants';
import type { ILevelData, ICheckpoint } from '../types/entities';
import { EntityFactory } from '../factories/EntityFactory';
import { InputManager } from '../managers/InputManager';
import { GameStateManager } from '../managers/GameStateManager';
import { HUDManager } from '../managers/HUDManager';
import { AudioManager } from '../managers/AudioManager';
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { Coin } from '../entities/Coin';
import { Checkpoint } from '../entities/Checkpoint';
import { EnemyBird } from '../entities/EnemyBird';
import { EnemyShark } from '../entities/EnemyShark';
import { EnemyProjectile } from '../entities/EnemyProjectile';
import { PowerUpWizardHat } from '../entities/PowerUpWizardHat';
import { PlayerProjectile } from '../entities/PlayerProjectile';

export class GameScene extends Phaser.Scene {
  private levelData!: ILevelData;
  private entityFactory!: EntityFactory;
  private inputManager!: InputManager;
  private gameStateManager!: GameStateManager;
  private hudManager!: HUDManager;
  private audioManager!: AudioManager;

  // Game entities
  private player!: Player;
  private platforms!: Phaser.GameObjects.Group;
  private coins!: Phaser.GameObjects.Group;
  private checkpoints!: Phaser.GameObjects.Group;
  private birds!: Phaser.GameObjects.Group;
  private sharks!: Phaser.GameObjects.Group;
  private enemyProjectiles!: Phaser.GameObjects.Group;
  private wizardHats!: Phaser.GameObjects.Group;
  private playerProjectiles!: Phaser.GameObjects.Group;

  // Death/respawn state
  private isDead = false;
  private deathTimer = 0;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  init(): void {
    console.log('[GameScene] Initializing...');
  }

  create(): void {
    console.log('[GameScene] Creating game...');

    // Initialize managers
    this.entityFactory = new EntityFactory(this);
    this.inputManager = new InputManager();
    this.inputManager.init(this);
    this.gameStateManager = new GameStateManager();
    this.hudManager = new HUDManager();
    this.audioManager = new AudioManager();
    this.audioManager.init(this);

    // Start new game session
    this.gameStateManager.startNewSession();

    // Load level data
    this.loadLevel('level1');

    // Create groups
    this.createGroups();

    // Spawn entities from level data
    this.spawnEntities();

    // Setup collisions
    this.setupCollisions();

    // Initialize HUD
    this.hudManager.init(this);
    this.updateHUD();

    // Setup pause functionality
    this.input.keyboard?.on('keydown-ESC', () => {
      this.handlePause();
    });

    console.log('[GameScene] Setup complete');
  }

  update(_time: number, delta: number): void {
    // Update managers
    this.inputManager.update(delta);
    this.gameStateManager.updateTimer(delta);

    // Update HUD timer
    this.hudManager.updateTimer(this.gameStateManager.getFormattedTime());

    // Handle death timer
    if (this.isDead) {
      this.deathTimer += delta;
      if (this.deathTimer >= 2000) {
        // 2 second death delay
        this.handleRespawn();
      }
      return; // Skip player update during death
    }

    // Update player with input
    if (this.player && this.player.isActive) {
      const moveX = this.inputManager.getMovementX();
      this.player.move(moveX);

      if (this.inputManager.isJumpPressed()) {
        this.player.jump();
        this.audioManager.playSfx('jump');
        this.inputManager.consumeJump(); // Clear jump buffer
      }

      if (this.inputManager.isShootPressed()) {
        const projectile = this.player.shoot();
        if (projectile) {
          // Create projectile using factory
          const playerProjectile = this.entityFactory.createPlayerProjectile(
            this.player.sprite.x + (this.player.facingDirection * 20),
            this.player.sprite.y,
            this.player.facingDirection
          ) as PlayerProjectile;
          
          this.playerProjectiles.add(playerProjectile.sprite);
          this.audioManager.playSfx('shoot');
        }
      }

      this.player.update(delta);

      // Check for falling into pit
      if (this.player.sprite.y > this.levelData.metadata.height) {
        this.handlePlayerDeath();
      }
    }
  }

  /**
   * Load level data from JSON
   */
  private loadLevel(levelKey: string): void {
    this.levelData = this.cache.json.get(levelKey);
    console.log('[GameScene] Level loaded:', this.levelData.metadata.name);

    // Set world bounds based on level size
    this.physics.world.setBounds(
      0,
      0,
      this.levelData.metadata.width,
      this.levelData.metadata.height
    );

    // Set camera bounds
    this.cameras.main.setBounds(
      0,
      0,
      this.levelData.metadata.width,
      this.levelData.metadata.height
    );
  }

  private createGroups(): void {
    // Create physics groups
    this.platforms = this.add.group();
    this.coins = this.add.group({
      runChildUpdate: true, // Enable update() calls on group children
    });
    this.checkpoints = this.add.group();
    this.birds = this.add.group({
      runChildUpdate: true, // Enable update() calls for birds
    });
    this.sharks = this.add.group({
      runChildUpdate: true, // Enable update() calls for sharks
    });
    this.enemyProjectiles = this.add.group({
      runChildUpdate: true, // Enable update() calls for projectiles
    });
    this.wizardHats = this.add.group({
      runChildUpdate: true, // Enable update() calls for power-ups
    });
    this.playerProjectiles = this.add.group({
      runChildUpdate: true, // Enable update() calls for player projectiles
    });

    console.log('[GameScene] Groups created');
  }

  private spawnEntities(): void {
    // Spawn platforms
    this.levelData.platforms.forEach((platformData) => {
      const platform = this.entityFactory.createStaticPlatform(
        platformData.x,
        platformData.y,
        platformData.width,
        platformData.height
      ) as Platform;
      this.platforms.add(platform.sprite);
    });

    // Spawn coins
    this.levelData.coins.forEach((coinData) => {
      const coin = this.entityFactory.createCoin(coinData.x, coinData.y) as Coin;
      this.coins.add(coin.sprite);
    });

    // Spawn checkpoints
    this.levelData.checkpoints.forEach((checkpointData) => {
      const checkpoint = this.entityFactory.createCheckpoint(
        checkpointData.x,
        checkpointData.y
      ) as Checkpoint;
      this.checkpoints.add(checkpoint.sprite);
    });

    // Spawn enemy birds
    this.levelData.enemies.forEach((enemyData) => {
      if (enemyData.type === 'bird') {
        const bird = this.entityFactory.createBird(
          enemyData.x,
          enemyData.y,
          enemyData.flyDirection as 1 | -1,
          (projectile) => {
            // Add dropped projectile to the scene group
            this.enemyProjectiles.add(projectile.sprite);
          }
        ) as EnemyBird;
        this.birds.add(bird.sprite);
      } else if (enemyData.type === 'shark') {
        const shark = this.entityFactory.createShark(
          enemyData.x,
          enemyData.y,
          enemyData.patrolStart || enemyData.y - 100,
          enemyData.patrolEnd || enemyData.y + 100
        ) as EnemyShark;
        this.sharks.add(shark.sprite);
      }
    });

    // Spawn power-ups (wizard hats)
    this.levelData.powerUps.forEach((powerUpData) => {
      if (powerUpData.type === 'wizard-hat') {
        const wizardHat = this.entityFactory.createWizardHat(
          powerUpData.x,
          powerUpData.y
        ) as PowerUpWizardHat;
        this.wizardHats.add(wizardHat.sprite);
      }
    });

    // Spawn player
    this.player = this.entityFactory.createPlayer(
      this.levelData.playerStart.x,
      this.levelData.playerStart.y
    ) as Player;

    // Camera follows player
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    console.log('[GameScene] Entities spawned');
  }

  private setupCollisions(): void {
    // Player collides with platforms
    this.physics.add.collider(this.player.sprite, this.platforms);

    // Coin collection
    this.physics.add.overlap(
      this.player.sprite,
      this.coins,
      this.handleCoinCollection,
      undefined,
      this
    );

    // Checkpoint activation
    this.physics.add.overlap(
      this.player.sprite,
      this.checkpoints,
      this.handleCheckpointActivation,
      undefined,
      this
    );

    // Player hit by enemy bird
    this.physics.add.overlap(
      this.player.sprite,
      this.birds,
      this.handlePlayerHitByBird,
      undefined,
      this
    );

    // Player hit by enemy shark
    this.physics.add.overlap(
      this.player.sprite,
      this.sharks,
      this.handlePlayerHitByShark,
      undefined,
      this
    );

    // Player hit by enemy projectile
    this.physics.add.overlap(
      this.player.sprite,
      this.enemyProjectiles,
      this.handlePlayerHitByProjectile,
      undefined,
      this
    );

    // Player collects wizard hat
    this.physics.add.overlap(
      this.player.sprite,
      this.wizardHats,
      this.handleWizardHatCollection,
      undefined,
      this
    );

    // Player projectile hits bird
    this.physics.add.overlap(
      this.playerProjectiles,
      this.birds,
      this.handlePlayerProjectileHitBird,
      undefined,
      this
    );

    // Player projectile hits shark
    this.physics.add.overlap(
      this.playerProjectiles,
      this.sharks,
      this.handlePlayerProjectileHitShark,
      undefined,
      this
    );

    console.log('[GameScene] Collisions configured');
  }

  private handleCoinCollection(
    _playerBody: unknown,
    coinSprite: unknown
  ): void {
    // Get sprite
    const sprite = coinSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find coin entity from sprite
    const coin = sprite.getData('entity') as Coin;
    if (!coin) return;

    // Collect coin
    coin.collect(this.player);
    
    // Play collect sound
    this.audioManager.playSfx('coin');
    
    // Update game state
    this.gameStateManager.collectCoin();
    this.updateHUD();
  }

  private handleCheckpointActivation(
    _playerBody: unknown,
    checkpointSprite: unknown
  ): void {
    // Get sprite
    const sprite = checkpointSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find checkpoint entity from sprite
    const checkpoint = sprite.getData('entity') as Checkpoint;
    if (!checkpoint) return;

    if (!checkpoint.isActivated) {
      checkpoint.activate();

      // Play checkpoint sound
      this.audioManager.playSfx('checkpoint');

      // Save checkpoint in game state
      const respawnPos = checkpoint.getRespawnPosition();
      this.gameStateManager.setCheckpoint(respawnPos);

      console.log('[GameScene] Checkpoint activated');
    }
  }

  private handlePlayerHitByBird(
    _playerBody: unknown,
    birdSprite: unknown
  ): void {
    if (this.isDead) return; // Already dead, ignore

    // Get sprite
    const sprite = birdSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find bird entity from sprite
    const bird = sprite.getData('entity') as EnemyBird;
    if (!bird || !bird.isAlive) return;

    // Player takes damage, bird dies
    this.handlePlayerDeath();
    bird.die();
  }

  private handlePlayerHitByShark(
    _playerBody: unknown,
    sharkSprite: unknown
  ): void {
    if (this.isDead) return; // Already dead, ignore

    // Get sprite
    const sprite = sharkSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find shark entity from sprite
    const shark = sprite.getData('entity') as EnemyShark;
    if (!shark || !shark.isAlive) return;

    // Player takes damage, shark dies
    this.handlePlayerDeath();
    shark.die();
  }

  private handlePlayerHitByProjectile(
    _playerBody: unknown,
    projectileSprite: unknown
  ): void {
    if (this.isDead) return; // Already dead, ignore

    // Get sprite
    const sprite = projectileSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find projectile entity from sprite
    const projectile = sprite.getData('entity') as EnemyProjectile;
    if (!projectile || !projectile.isActive) return;

    // Player takes damage, projectile destroyed
    this.handlePlayerDeath();
    projectile.destroy();
  }

  private handleWizardHatCollection(
    _playerBody: unknown,
    wizardHatSprite: unknown
  ): void {
    // Get sprite
    const sprite = wizardHatSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find wizard hat entity from sprite
    const wizardHat = sprite.getData('entity') as PowerUpWizardHat;
    if (!wizardHat || wizardHat.isCollected) return;

    // Collect the power-up
    wizardHat.collect(this.player);

    console.log('[GameScene] Wizard hat collected');
  }

  private handlePlayerProjectileHitBird(
    projectileSprite: unknown,
    birdSprite: unknown
  ): void {
    // Get sprites
    const pSprite = projectileSprite as Phaser.Physics.Arcade.Sprite;
    const bSprite = birdSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find entities from sprites
    const projectile = pSprite.getData('entity') as PlayerProjectile;
    const bird = bSprite.getData('entity') as EnemyBird;
    
    if (!projectile || !projectile.isActive) return;
    if (!bird || !bird.isAlive) return;

    // Destroy both
    projectile.destroy();
    bird.die();

    console.log('[GameScene] Player projectile hit bird');
  }

  private handlePlayerProjectileHitShark(
    projectileSprite: unknown,
    sharkSprite: unknown
  ): void {
    // Get sprites
    const pSprite = projectileSprite as Phaser.Physics.Arcade.Sprite;
    const sSprite = sharkSprite as Phaser.Physics.Arcade.Sprite;
    
    // Find entities from sprites
    const projectile = pSprite.getData('entity') as PlayerProjectile;
    const shark = sSprite.getData('entity') as EnemyShark;
    
    if (!projectile || !projectile.isActive) return;
    if (!shark || !shark.isAlive) return;

    // Destroy both
    projectile.destroy();
    shark.die();

    console.log('[GameScene] Player projectile hit shark');
  }

  private handlePlayerDeath(): void {
    if (this.isDead) return; // Already dead

    this.isDead = true;
    this.deathTimer = 0;

    // Play death sound
    this.audioManager.playSfx('death');

    // Lose a life
    const remainingLives = this.gameStateManager.loseLife();
    this.updateHUD();

    console.log(`[GameScene] Player died. Lives remaining: ${remainingLives}`);

    if (remainingLives <= 0) {
      // Game over
      this.handleGameOver();
    }
  }

  private handleRespawn(): void {
    this.isDead = false;
    this.deathTimer = 0;

    // Get respawn position
    const checkpoint = this.gameStateManager.getCurrentCheckpoint();
    const respawnPos = checkpoint ?? this.levelData.playerStart;

    // Respawn player at checkpoint
    this.player.respawnAtCheckpoint(respawnPos as unknown as ICheckpoint);

    console.log('[GameScene] Player respawned');
  }

  private handleGameOver(): void {
    console.log('[GameScene] Game Over');

    // Play game over sound
    this.audioManager.playSfx('gameover');
    this.audioManager.stopMusic();

    // End session
    const sessionData = this.gameStateManager.endSession();
    console.log('Final stats:', sessionData);

    // Show game over screen
    this.time.delayedCall(1000, () => {
      this.scene.start(SCENE_KEYS.GAME_OVER, sessionData);
    });
  }

  /**
   * Handle pause menu
   */
  private handlePause(): void {
    console.log('[GameScene] Pausing game');
    this.scene.pause(SCENE_KEYS.GAME);
    this.scene.launch(SCENE_KEYS.PAUSE, { gameSceneKey: SCENE_KEYS.GAME });
  }

  private updateHUD(): void {
    this.hudManager.updateLives(this.gameStateManager.getLives());
    this.hudManager.updateCoins(this.gameStateManager.getCoinCount());
  }
}

