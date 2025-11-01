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
import { Player } from '../entities/Player';
import { Platform } from '../entities/Platform';
import { Coin } from '../entities/Coin';
import { Checkpoint } from '../entities/Checkpoint';

export class GameScene extends Phaser.Scene {
  private levelData!: ILevelData;
  private entityFactory!: EntityFactory;
  private inputManager!: InputManager;
  private gameStateManager!: GameStateManager;
  private hudManager!: HUDManager;

  // Game entities
  private player!: Player;
  private platforms!: Phaser.GameObjects.Group;
  private coins!: Phaser.GameObjects.Group;
  private checkpoints!: Phaser.GameObjects.Group;

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
        this.inputManager.consumeJump(); // Clear jump buffer
      }

      if (this.inputManager.isShootPressed()) {
        // Shooting will be implemented in Phase 4 (US2)
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

      // Save checkpoint in game state
      const respawnPos = checkpoint.getRespawnPosition();
      this.gameStateManager.setCheckpoint(respawnPos);

      console.log('[GameScene] Checkpoint activated');
    }
  }

  private handlePlayerDeath(): void {
    if (this.isDead) return; // Already dead

    this.isDead = true;
    this.deathTimer = 0;

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

