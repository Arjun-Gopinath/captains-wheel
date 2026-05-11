import Phaser from 'phaser';
import { Wheel } from '../entities/Wheel.js';
import { HealthManager } from '../managers/HealthManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { getActiveSegments } from '../config/segments.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;

    this.health = new HealthManager(100);
    this.scorer = new ScoreManager();

    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.wheel = new Wheel(this, width / 2, height / 2, 160, segments);
  }
}
