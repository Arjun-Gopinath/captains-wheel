import Phaser from 'phaser';
import { Wheel } from '../entities/Wheel.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { HealthManager } from '../managers/HealthManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { getActiveSegments } from '../config/segments.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.health  = new HealthManager(100);
    this.scorer  = new ScoreManager();

    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.wheel     = new Wheel(this, cx, cy, 160, segments);
    this.obstacles = new ObstacleManager(this, cx, cy, width, height);
  }

  update(_time, delta) {
    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.obstacles.update(delta, segments);
  }
}
