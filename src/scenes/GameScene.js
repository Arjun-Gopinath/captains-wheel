import Phaser from 'phaser';
import { Wheel } from '../entities/Wheel.js';
import { ObstacleManager } from '../managers/ObstacleManager.js';
import { HealthManager } from '../managers/HealthManager.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { UIManager } from '../managers/UIManager.js';
import { getActiveSegments } from '../config/segments.js';
import { isMatch } from '../utils/matcher.js';

const COLLISION_RADIUS = 170;
const MISS_DAMAGE      = 10;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.health    = new HealthManager(100);
    this.scorer    = new ScoreManager();
    this.ui        = new UIManager(this, width);

    const segments  = getActiveSegments(this.scorer.getSegmentCount());
    this.wheel      = new Wheel(this, cx, cy, 160, segments);
    this.obstacles  = new ObstacleManager(this, cx, cy, width, height);
  }

  update(_time, delta) {
    if (this.health.isDead()) return;

    const segments = getActiveSegments(this.scorer.getSegmentCount());
    this.obstacles.update(delta, segments);
    this._resolveCollisions(segments);
    this.ui.update(this.health, this.scorer);
  }

  _resolveCollisions(segments) {
    const hits = this.obstacles.getObstaclesWithinRadius(COLLISION_RADIUS);

    for (const obs of hits) {
      const segmentIndex  = this.wheel.getSegmentFacing(obs.approachAngle);
      const facingSegment = segments[segmentIndex];
      const matched       = isMatch(facingSegment, obs.segment);

      if (matched) {
        const heal = this.scorer.addMatch();
        this.health.heal(heal);
        this._flashMatch();
      } else {
        this.scorer.addMiss();
        this.health.takeDamage(MISS_DAMAGE);
        this._flashMiss();
      }

      this.obstacles.remove(obs);
      this._syncWheelSegments(segments);
    }
  }

  _syncWheelSegments(currentSegments) {
    const next = getActiveSegments(this.scorer.getSegmentCount());
    if (next.length !== currentSegments.length) {
      this.wheel.setSegments(next);
    }
  }

  _flashMatch() {
    this.cameras.main.flash(120, 0, 200, 0, false);
  }

  _flashMiss() {
    this.cameras.main.flash(200, 200, 0, 0, false);
  }
}
