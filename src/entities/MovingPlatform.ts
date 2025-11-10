/**
 * Moving Platform Entity
 * Platform that moves along a predefined path with constant speed
 */

import Phaser from 'phaser';
import type { IMovingPlatform } from '../types/entities';

export class MovingPlatform implements IMovingPlatform {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly id: string;
  readonly type = 'platform-moving' as const;
  isActive = true;

  width: number;
  height: number;
  textureKey: string;
  path: Array<{ x: number; y: number }>;
  speed: number;
  currentWaypoint = 0;
  pathIndicators: Phaser.GameObjects.Graphics[] = [];

  private scene: Phaser.Scene;
  private tween?: Phaser.Tweens.Tween;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    path: Array<{ x: number; y: number }>,
    speed: number
  ) {
    this.scene = scene;
    this.id = `moving-platform-${Date.now()}-${Math.random()}`;
    this.width = width;
    this.height = height;
    this.textureKey = 'platform-placeholder';
    this.path = path;
    this.speed = speed;

    // Create placeholder texture if needed
    if (!scene.textures.exists('platform-placeholder')) {
      this.createPlaceholderTexture(scene);
    }

    // Create moving sprite (not static)
    this.sprite = scene.physics.add.sprite(x, y, 'platform-placeholder');
    this.sprite.setDisplaySize(width, height);
    this.sprite.setOrigin(0.5, 0.5);
    
    // Configure physics body
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(width, height);

    // Store reference
    this.sprite.setData('entity', this);

    // Create path indicators
    this.createPathIndicators();

    // Start moving along path
    this.startMovement();

    console.log(`[MovingPlatform] Created at (${x}, ${y}) with ${path.length} waypoints, speed ${speed}`);
  }

  /**
   * Create placeholder texture (brown platform)
   */
  private createPlaceholderTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x8b4513, 1); // Brown
    graphics.fillRect(0, 0, 100, 20);
    graphics.generateTexture('platform-placeholder', 100, 20);
    graphics.destroy();
  }

  /**
   * Create visual indicators showing the platform's movement path
   */
  createPathIndicators(): void {
    // Clear existing indicators
    this.pathIndicators.forEach(indicator => indicator.destroy());
    this.pathIndicators = [];

    // Draw line connecting waypoints
    if (this.path.length < 2) return;

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xffff00, 0.5); // Yellow dashed line
    graphics.setDepth(10); // Above most things but below HUD

    // Draw path
    graphics.beginPath();
    graphics.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      graphics.lineTo(this.path[i].x, this.path[i].y);
    }
    // Loop back to start
    graphics.lineTo(this.path[0].x, this.path[0].y);
    graphics.strokePath();

    // Draw waypoint markers (small circles)
    graphics.fillStyle(0xffff00, 0.7);
    this.path.forEach(waypoint => {
      graphics.fillCircle(waypoint.x, waypoint.y, 6);
    });

    this.pathIndicators.push(graphics);
  }

  /**
   * Start platform movement along path
   */
  private startMovement(): void {
    if (this.path.length < 2) {
      console.warn('[MovingPlatform] Path has less than 2 waypoints, platform will not move');
      return;
    }

    // Calculate total path distance
    let totalDistance = 0;
    for (let i = 0; i < this.path.length; i++) {
      const current = this.path[i];
      const next = this.path[(i + 1) % this.path.length];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate total duration based on speed (pixels per second)
    const duration = (totalDistance / this.speed) * 1000; // Convert to milliseconds

    // Create looping tween through all waypoints
    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      duration: duration,
      ease: 'Linear',
      repeat: -1, // Loop forever
      paused: false,
      props: {
        x: { from: this.path[0].x, to: this.path[0].x },
        y: { from: this.path[0].y, to: this.path[0].y }
      },
      onUpdate: (tween) => {
        // Calculate which segment we're on
        const progress = tween.progress;
        const segmentCount = this.path.length;
        const currentSegment = Math.floor(progress * segmentCount);
        const segmentProgress = (progress * segmentCount) - currentSegment;

        const startPoint = this.path[currentSegment % this.path.length];
        const endPoint = this.path[(currentSegment + 1) % this.path.length];

        // Interpolate position
        const x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
        const y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;

        this.sprite.setPosition(x, y);
      }
    });
  }

  /**
   * Move to next waypoint (not used with tween, but kept for interface)
   */
  moveAlongPath(_delta: number): void {
    // Movement is handled by tween
  }

  /**
   * Advance to next waypoint (not used with tween, but kept for interface)
   */
  advanceWaypoint(): void {
    // Waypoint advancement is handled by tween
  }

  /**
   * Update platform (called every frame)
   */
  update(_delta: number): void {
    // Movement handled by tween
  }

  /**
   * Destroy platform
   */
  destroy(): void {
    if (this.tween) {
      this.tween.remove();
    }
    this.pathIndicators.forEach(indicator => indicator.destroy());
    this.pathIndicators = [];
    this.sprite.destroy();
    this.isActive = false;
  }
}
